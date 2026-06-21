import { PrismaClient } from '@raaghas/database';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

const SHOP_URL = process.argv[2];
const ACCESS_TOKEN = process.argv[3];

if (!SHOP_URL || !ACCESS_TOKEN) {
  console.error("Usage: npx ts-node sync_shopify_inventory.ts <shopUrl> <accessToken>");
  process.exit(1);
}

// Normalize URL
let host = SHOP_URL.replace(/^https?:\/\//, '').split('/')[0];
if (!host.includes('.myshopify.com') && !host.includes('.')) {
  host = `${host}.myshopify.com`;
}

async function fetchWithRetry(url: string, options: any, retries = 3): Promise<any> {
  try {
    const res = await fetch(url, options);
    if (res.status === 429) {
      if (retries > 0) {
        console.log(`Rate limited! Waiting 5s before retry...`);
        await new Promise(r => setTimeout(r, 5000));
        return fetchWithRetry(url, options, retries - 1);
      }
      throw new Error(`Rate limit exceeded and out of retries for ${url}`);
    }
    if (!res.ok) {
      throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
    }
    return res;
  } catch (err) {
    if (retries > 0) {
      console.log(`Fetch error: ${err}. Retrying in 2s...`);
      await new Promise(r => setTimeout(r, 2000));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
}

async function runSync() {
  console.log(`Starting Inventory Healing Sync for ${host}...`);

  // Step 1: Fetch all Shopify products to map variants and inventory_item_ids
  console.log("Fetching products to map inventory_item_ids...");
  let nextUrl: string | null = `https://${host}/admin/api/2024-04/products.json?limit=250`;
  const inventoryItemMap = new Map<number, { sku: string; handle: string; productId: number; untracked: boolean; spVariantId: number }>();

  while (nextUrl) {
    const res = await fetchWithRetry(nextUrl, {
      headers: { 'X-Shopify-Access-Token': ACCESS_TOKEN }
    });
    const data = await res.json();
    
    for (const p of data.products) {
      for (const v of p.variants) {
        const sku = v.sku || `SP-${v.id}`;
        // untracked if inventory_management is null or blank
        const untracked = !v.inventory_management;
        inventoryItemMap.set(v.inventory_item_id, {
          sku,
          handle: p.handle,
          productId: p.id,
          untracked,
          spVariantId: v.id
        });
      }
    }

    const linkHeader = res.headers.get('link');
    if (linkHeader && linkHeader.includes('rel="next"')) {
       const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
       nextUrl = match ? match[1] : null;
    } else {
       nextUrl = null;
    }
  }

  console.log(`Found ${inventoryItemMap.size} inventory items to sync.`);

  // Step 2: Fetch Inventory Levels in chunks of 50
  const inventoryItemIds = Array.from(inventoryItemMap.keys());
  const chunkSize = 50;
  
  // A map to accumulate stock from multiple locations
  const trueStockMap = new Map<number, number>();

  console.log("Fetching precise stock levels across all locations...");
  for (let i = 0; i < inventoryItemIds.length; i += chunkSize) {
    const chunk = inventoryItemIds.slice(i, i + chunkSize);
    const idsParam = chunk.join(',');
    
    const res = await fetchWithRetry(`https://${host}/admin/api/2024-04/inventory_levels.json?inventory_item_ids=${idsParam}`, {
       headers: { 'X-Shopify-Access-Token': ACCESS_TOKEN }
    });
    const data = await res.json();

    for (const level of data.inventory_levels) {
      const currentVal = trueStockMap.get(level.inventory_item_id) || 0;
      trueStockMap.set(level.inventory_item_id, currentVal + (level.available || 0));
    }
    
    process.stdout.write(`\rProcessed ${Math.min(i + chunkSize, inventoryItemIds.length)} / ${inventoryItemIds.length}`);
  }
  console.log("\nFinished fetching inventory levels.");

  // Step 3: Update our database
  console.log("Syncing to database...");
  let updatedCount = 0;
  let notFoundCount = 0;

  for (const [itemId, info] of inventoryItemMap.entries()) {
    let finalInventory = 0;
    
    if (info.untracked) {
      finalInventory = 9999; // Set to 9999 to guarantee it shows as In Stock
    } else {
      finalInventory = trueStockMap.get(itemId) || 0;
    }

    // Try finding the variant by SKU first
    let dbVariant = await prisma.variant.findFirst({
      where: { sku: info.sku }
    });

    // Fallback: If SKU changed or conflicted, try the resolved SKU
    if (!dbVariant) {
       const resolvedSku = `${info.sku}-${info.spVariantId}`;
       dbVariant = await prisma.variant.findFirst({
         where: { sku: resolvedSku }
       });
    }

    if (dbVariant) {
       if (dbVariant.inventory !== finalInventory) {
           await prisma.variant.update({
             where: { id: dbVariant.id },
             data: { inventory: finalInventory }
           });
           updatedCount++;
       }
    } else {
       notFoundCount++;
    }
  }

  console.log(`\nInventory Sync Complete!`);
  console.log(`- Variants updated: ${updatedCount}`);
  console.log(`- Untracked variants set to 9999: ${Array.from(inventoryItemMap.values()).filter(v => v.untracked).length}`);
  console.log(`- Variants not found in DB (SKU mismatch): ${notFoundCount}`);
  
  process.exit(0);
}

runSync().catch(e => {
  console.error("Sync Failed:", e);
  process.exit(1);
});
