import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

// Pre-load optimizer to avoid repeated requires
const { ImageOptimizer } = require('../common/utils/image-optimizer');

export interface MigrationStatus {
  isRunning: boolean;
  totalProducts: number;
  processedCount: number;
  successCount: number;
  skipCount: number;
  errorCount: number;
  currentProduct?: string;
  logs: Array<{ type: 'info' | 'success' | 'warn' | 'error'; message: string; time: string }>;
}

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);
  private status: MigrationStatus = this.getInitialStatus();
  private readonly FETCH_TIMEOUT = 30000; // 30 seconds

  constructor(private prisma: PrismaService) {}

  private getInitialStatus(): MigrationStatus {
    return {
      isRunning: false,
      totalProducts: 0,
      processedCount: 0,
      successCount: 0,
      skipCount: 0,
      errorCount: 0,
      logs: [],
    };
  }

  private addLog(type: 'info' | 'success' | 'warn' | 'error', message: string) {
    const time = new Date().toLocaleTimeString();
    this.status.logs.unshift({ type, message, time });
    if (this.status.logs.length > 100) this.status.logs.pop(); 
    
    if (type === 'error') this.logger.error(message);
    else if (type === 'warn') this.logger.warn(message);
    else this.logger.log(message);
  }

  getStatus() {
    return this.status;
  }

  /**
   * Helper for robust fetch with timeout and headers
   */
  private async fetchWithTimeout(url: string, options: any = {}) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.FETCH_TIMEOUT);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'User-Agent': 'Raaghas-Migration-Engine/2.1 (Node.js/Expert-Patch)',
          ...options.headers,
        },
      });
      clearTimeout(id);
      return response;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  async startMigration(shopUrl: string, accessToken: string) {
    if (this.status.isRunning) {
      this.addLog('warn', 'Migration is already running.');
      return this.status;
    }

    if (!shopUrl || !accessToken) {
      this.addLog('error', 'Missing shopUrl or accessToken');
      return this.status;
    }

    this.status = this.getInitialStatus();
    this.status.isRunning = true;
    
    // Hardened URL Normalization
    let host = shopUrl.replace(/^https?:\/\//, '').split('/')[0];
    if (!host.includes('.myshopify.com') && !host.includes('.')) {
      host = `${host}.myshopify.com`;
    }

    this.addLog('info', `Initiating Shopify Migration Engine for ${host}`);

    this.processMigration(host, accessToken).catch(err => {
      this.status.isRunning = false;
      this.addLog('error', `Fatal Engine Crash: ${err.message}`);
    });

    return this.status;
  }

  private async downloadImage(url: string, handle: string, position: number): Promise<string | null> {
    try {
      const response = await this.fetchWithTimeout(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const buffer = Buffer.from(await response.arrayBuffer());
      const ext = path.extname(new URL(url).pathname) || '.jpg';
      const filename = `${handle}-${position}${ext}`;
      const uploadDir = path.join(process.cwd(), 'uploads', 'products');
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filepath = path.join(uploadDir, filename);
      fs.writeFileSync(filepath, buffer);
      
      try {
        await ImageOptimizer.optimize(filepath);
        const webpFilename = filename.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        return `/uploads/products/${webpFilename}`;
      } catch (optErr) {
        return `/uploads/products/${filename}`;
      }
    } catch (error: any) {
      this.addLog('error', `Failed image download: ${url.substring(0, 50)}... (${error.message})`);
      return null;
    }
  }

  private async processMigration(shopUrl: string, accessToken: string) {
    try {
      // 1. Initial count check
      const countRes = await this.fetchWithTimeout(`https://${shopUrl}/admin/api/2024-04/products/count.json?status=active,draft,archived`, {
        headers: { 'X-Shopify-Access-Token': accessToken }
      });
      
      if (!countRes.ok) {
         const errorText = await countRes.text();
         throw new Error(`Auth/URL failed (${countRes.status}). Ensure URL is correct.`);
      }
      
      const countData = await countRes.json();
      this.status.totalProducts = countData.count;
      this.addLog('info', `Discovered ${this.status.totalProducts} products. Beginning extraction...`);

      let nextUrl: string | null = `https://${shopUrl}/admin/api/2024-04/products.json?limit=250&status=active,draft,archived`;

      // ─── FIX 1: De-duplication Guard ──────────────────────────────────────────
      // Shopify's cursor-based pagination can return the same product multiple
      // times when products are modified during a migration run. We track every
      // handle we've processed and skip any repeat encounters.
      const processedHandles = new Set<string>();
      
      while (nextUrl) {
         let res = await this.fetchWithTimeout(nextUrl, { 
           headers: { 'X-Shopify-Access-Token': accessToken } 
         });

         if (res.status === 429) {
           this.addLog('warn', 'Shopify Rate Limit hit. Cooling down for 10 seconds...');
           await new Promise(resolve => setTimeout(resolve, 10000));
           continue;
         }

         if (!res.ok) {
           this.addLog('error', `API fetch failed (${res.status}). Skipping chunk.`);
           break;
         }

         const data = await res.json();
         const products = data.products || [];

          for (const spProduct of products) {
            // ─── FIX 1 GUARD: Skip if already processed this page cycle ──────
            if (processedHandles.has(spProduct.handle)) {
              this.status.skipCount++;
              this.status.processedCount++;
              this.addLog('info', `[De-dupe] Skipping duplicate page entry: ${spProduct.title}`);
              continue;
            }
            processedHandles.add(spProduct.handle);
            // ──────────────────────────────────────────────────────────────────

            this.status.currentProduct = spProduct.title;
            
            try {
              const option1 = spProduct.options[0]?.name || null;
              const option2 = spProduct.options[1]?.name || null;
              const option3 = spProduct.options[2]?.name || null;

              const p = await this.prisma.product.upsert({
                where: { handle: spProduct.handle },
                update: {
                  shopifyId: spProduct.id.toString(),
                  title: spProduct.title,
                  description: spProduct.body_html || '',
                  vendor: spProduct.vendor || '',
                  category: spProduct.product_type || 'Uncategorized',
                  tags: spProduct.tags || '',
                  published: spProduct.status === 'active',
                },
                create: {
                  shopifyId: spProduct.id.toString(),
                  title: spProduct.title,
                  handle: spProduct.handle,
                  description: spProduct.body_html || '',
                  vendor: spProduct.vendor || '',
                  category: spProduct.product_type || 'Uncategorized',
                  tags: spProduct.tags || '',
                  published: spProduct.status === 'active',
                }
              });

              // Process Variants
              for (const spVariant of spProduct.variants) {
                 try {
                   // ─── FIX 2: SKU Auto-Resolution ───────────────────────────
                   // In Shopify, multiple variants of the same product (e.g. all
                   // sizes of a Kurti) often share the same SKU — which is valid
                   // in Shopify but violates our unique SKU constraint. Instead of
                   // skipping, we detect the conflict and auto-generate a unique
                   // SKU using the Shopify variant ID as a suffix. This ensures
                   // every variant is imported with no data loss.
                   let sku = spVariant.sku || `SP-${spVariant.id}`;
                   
                   // Match by Handle (productId) + Size/Color (options) instead of SKU
                   let existingVariant = await this.prisma.variant.findFirst({
                     where: {
                       productId: p.id,
                       option1Value: spVariant.option1 || null,
                       option2Value: spVariant.option2 || null,
                       option3Value: spVariant.option3 || null,
                     }
                   });

                   // Fallback to SKU check to prevent unique constraint errors if options changed
                   if (!existingVariant) {
                     existingVariant = await this.prisma.variant.findUnique({ where: { sku } });
                   }

                   if (existingVariant && existingVariant.productId !== p.id) {
                     // Conflict: same SKU belongs to a DIFFERENT product.
                     // Auto-resolve by appending Shopify variant ID.
                     const resolvedSku = `${sku}-${spVariant.id}`;
                     this.addLog('warn', `SKU Conflict auto-resolved: "${sku}" → "${resolvedSku}" for ${spProduct.title}`);
                     sku = resolvedSku;
                   }
                   // ──────────────────────────────────────────────────────────

                   const price = parseFloat(spVariant.price || '0');
                   const cp = spVariant.compare_at_price ? parseFloat(spVariant.compare_at_price) : null;

                   if (existingVariant) {
                     await this.prisma.variant.update({
                       where: { id: existingVariant.id },
                       data: {
                         sku,
                         price: isNaN(price) ? 0 : price,
                         mrp: (cp && !isNaN(cp)) ? cp : null,
                         inventory: Number(spVariant.inventory_quantity) || 0,
                         option1Name: option1, option1Value: spVariant.option1 || null,
                         option2Name: option2, option2Value: spVariant.option2 || null,
                         option3Name: option3, option3Value: spVariant.option3 || null,
                       }
                     });
                   } else {
                     await this.prisma.variant.create({
                       data: {
                         productId: p.id, sku,
                         price: isNaN(price) ? 0 : price,
                         mrp: (cp && !isNaN(cp)) ? cp : null,
                         inventory: Number(spVariant.inventory_quantity) || 0,
                         option1Name: option1, option1Value: spVariant.option1 || null,
                         option2Name: option2, option2Value: spVariant.option2 || null,
                         option3Name: option3, option3Value: spVariant.option3 || null,
                       }
                     });
                   }
                 } catch (vErr: any) {
                   this.addLog('error', `Failed to save variant ${spVariant.sku || spVariant.id} for product ${spProduct.title}: ${vErr?.message || 'Unknown database error'}`);
                 }
              }

              // Image Sync (Heal Protocol: Re-download if files are missing from disk)
              const existingImages = await this.prisma.image.findMany({ where: { productId: p.id } });
              
              let filesMissing = false;
              for (const img of existingImages) {
                const fullPath = path.join(process.cwd(), img.url);
                if (!fs.existsSync(fullPath)) {
                  filesMissing = true;
                  break;
                }
              }

              if (existingImages.length === 0 || filesMissing) {
                if (filesMissing) {
                  this.addLog('info', `Healing missing image files for: ${spProduct.title}`);
                  await this.prisma.image.deleteMany({ where: { productId: p.id } });
                }
                
                let position = 1;
                const imageList = (spProduct.images || []).slice(0, 10);
                for (const spImg of imageList) {
                   const localUrl = await this.downloadImage(spImg.src, spProduct.handle, position);
                   if (localUrl) {
                     await this.prisma.image.create({
                       data: { productId: p.id, url: localUrl, altText: spImg.alt || spProduct.title, position: position }
                     });
                   }
                   position++;
                }
              }

              this.status.successCount++;
            } catch (dbErr: any) {
              this.status.errorCount++;
              this.addLog('warn', `Skipped ${spProduct.title}: ${dbErr.message}`);
            }
            this.status.processedCount++;
          }

         const linkHeader = res.headers.get('link');
         if (linkHeader && linkHeader.includes('rel="next"')) {
            const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
            nextUrl = match ? match[1] : null;
         } else {
            nextUrl = null;
         }
      }

      this.status.isRunning = false;
      this.status.currentProduct = undefined;
      this.addLog('success', `Extraction complete. Syncing metadata...`);

      // Final Syncs
      await this.syncCustomCollections(shopUrl, accessToken);
      await this.syncSmartCollections(shopUrl, accessToken);
      await this.syncCollects(shopUrl, accessToken);
      this.addLog('success', 'Migration fully finalized.');

    } catch (err: any) {
      this.status.isRunning = false;
      this.addLog('error', `Migration halted: ${err.message}`);
    }
  }

  private async syncCustomCollections(shopUrl: string, accessToken: string) {
    this.addLog('info', 'Syncing Custom Collections...');
    try {
      const res = await this.fetchWithTimeout(`https://${shopUrl}/admin/api/2024-04/custom_collections.json`, {
        headers: { 'X-Shopify-Access-Token': accessToken }
      });
      if (!res.ok) return;
      const data = await res.json();
      for (const sc of (data.custom_collections || [])) {
        await this.prisma.collection.upsert({
          where: { handle: sc.handle },
          update: { shopifyId: sc.id.toString(), title: sc.title },
          create: { shopifyId: sc.id.toString(), handle: sc.handle, title: sc.title, description: sc.body_html || '' }
        });
      }
    } catch (err) {}
  }

  private async syncSmartCollections(shopUrl: string, accessToken: string) {
    this.addLog('info', 'Syncing Smart Collections...');
    try {
      const res = await this.fetchWithTimeout(`https://${shopUrl}/admin/api/2024-04/smart_collections.json`, {
        headers: { 'X-Shopify-Access-Token': accessToken }
      });
      if (!res.ok) return;
      const data = await res.json();
      for (const sc of (data.smart_collections || [])) {
        await this.prisma.collection.upsert({
          where: { handle: sc.handle },
          update: { shopifyId: sc.id.toString(), title: sc.title },
          create: { shopifyId: sc.id.toString(), handle: sc.handle, title: sc.title, description: sc.body_html || '' }
        });
      }
    } catch (err) {}
  }

  private async syncCollects(shopUrl: string, accessToken: string) {
    this.addLog('info', 'Mapping products to collections...');
    try {
      let nextUrl: string | null = `https://${shopUrl}/admin/api/2024-04/collects.json?limit=250`;
      while (nextUrl) {
        const res = await this.fetchWithTimeout(nextUrl, { headers: { 'X-Shopify-Access-Token': accessToken } });
        if (!res.ok) break;
        const data = await res.json();
        for (const collect of (data.collects || [])) {
          try {
            const product = await this.prisma.product.findUnique({ where: { shopifyId: collect.product_id.toString() } });
            const collection = await this.prisma.collection.findUnique({ where: { shopifyId: collect.collection_id.toString() } });
            if (product && collection) {
              await this.prisma.product.update({ where: { id: product.id }, data: { collections: { connect: { id: collection.id } } } });
            }
          } catch (err) {}
        }
        const linkHeader = res.headers.get('link');
        nextUrl = (linkHeader && linkHeader.includes('rel="next"')) ? linkHeader.match(/<([^>]+)>;\s*rel="next"/)?.[1] || null : null;
      }
    } catch (err) {}
  }

  async auditCollections() {
    const totalCollections = await this.prisma.collection.count();
    const orphanedCollections = await this.prisma.collection.findMany({
      where: { shopifyId: null },
      include: { _count: { select: { products: true } } }
    });
    const validCollections = await this.prisma.collection.findMany({
      where: { NOT: { shopifyId: null } },
      include: { _count: { select: { products: true } } }
    });

    return {
      total: totalCollections,
      orphans: orphanedCollections.map(c => ({
        id: c.id,
        title: c.title,
        handle: c.handle,
        productCount: c._count.products
      })),
      valid: validCollections.length,
      suggestions: orphanedCollections.map(orphan => {
        const match = validCollections.find(v => 
          v.title.toLowerCase().includes(orphan.title.toLowerCase()) || 
          orphan.title.toLowerCase().includes(v.title.toLowerCase())
        );
        return match ? { orphanId: orphan.id, orphanTitle: orphan.title, matchId: match.id, matchTitle: match.title } : null;
      }).filter(Boolean)
    };
  }

  async cleanupOrphanCollections() {
    this.addLog('info', 'Starting Collection Cleanup Protocol...');
    const audit = await this.auditCollections();
    let mergedCount = 0;
    let deletedCount = 0;

    for (const suggestion of audit.suggestions as any[]) {
      this.addLog('info', `Merging orphan "${suggestion.orphanTitle}" into official "${suggestion.matchTitle}"`);
      
      // 1. Move products to the official collection
      const orphan = await this.prisma.collection.findUnique({ 
        where: { id: suggestion.orphanId },
        include: { products: true }
      });

      if (orphan) {
        for (const product of orphan.products) {
          await this.prisma.product.update({
            where: { id: product.id },
            data: { collections: { connect: { id: suggestion.matchId } } }
          });
        }

        // 2. Delete the orphan
        await this.prisma.collection.delete({ where: { id: suggestion.orphanId } });
        mergedCount++;
      }
    }

    // Also delete orphans with 0 products that couldn't be matched
    const remainingOrphans = await this.prisma.collection.findMany({
      where: { shopifyId: null },
      include: { _count: { select: { products: true } } }
    });

    for (const orphan of remainingOrphans) {
      if (orphan._count.products === 0) {
        await this.prisma.collection.delete({ where: { id: orphan.id } });
        deletedCount++;
      }
    }

    this.addLog('success', `Cleanup finished: Merged ${mergedCount} collections, Deleted ${deletedCount} empty orphans.`);
    return { mergedCount, deletedCount };
  }

  async deepReset() {
    this.addLog('warn', 'INITIATING DEEP RESET PROTOCOL. ALL DATA WILL BE WIPED.');
    
    try {
      await this.prisma.$transaction(async (tx) => {
        // 1. Transactional Data (Orders & Logistics)
        await tx.shipment.deleteMany({});
        await tx.fulfillment.deleteMany({});
        await tx.orderItem.deleteMany({});
        await tx.order.deleteMany({});
        await tx.orderReturn.deleteMany({});
        await tx.wholesaleOrderItem.deleteMany({});
        await tx.wholesaleOrder.deleteMany({});
        
        // 2. Inventory & Feedback
        await tx.stockLog.deleteMany({});
        await tx.wishlistItem.deleteMany({});
        await tx.review.deleteMany({});
        
        // 3. Product Data
        await tx.image.deleteMany({});
        await tx.variant.deleteMany({});
        await tx.product.deleteMany({});
        
        // 4. Categorization
        await tx.collection.deleteMany({});
      });

      this.addLog('success', 'Deep Reset complete. Database is now in a pristine state.');
      return { success: true, message: 'All products, collections, and orders have been wiped.' };
    } catch (err: any) {
      this.addLog('error', `Deep Reset failed: ${err.message}`);
      throw err;
    }
  }
}
