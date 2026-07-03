/**
 * One-time migration to fix image positions on VPS.
 * Run on the VPS server to normalize all product image positions
 * so that the first image is always at position 0.
 * 
 * Usage: node fix-image-positions.js
 */

const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://raaghas_user:Raaghas%40Prod2024@localhost:5432/raaghas';

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log('Connected to database.');

  // 1. Find all products that have images not starting at position 0
  const productsRes = await client.query(`
    SELECT DISTINCT p.id, p.handle
    FROM "Product" p
    JOIN "Image" i ON i."productId" = p.id
    GROUP BY p.id, p.handle
    HAVING MIN(i.position) > 0
    ORDER BY p.handle
  `);

  console.log(`Found ${productsRes.rows.length} products with broken image positions.`);

  let fixed = 0;
  for (const product of productsRes.rows) {
    // Get all images for this product, ordered by current position
    const imagesRes = await client.query(
      `SELECT id, url, position FROM "Image" WHERE "productId" = $1 ORDER BY position ASC, "createdAt" ASC`,
      [product.id]
    );

    // Re-assign positions starting from 0
    for (let i = 0; i < imagesRes.rows.length; i++) {
      await client.query(
        `UPDATE "Image" SET position = $1 WHERE id = $2`,
        [i, imagesRes.rows[i].id]
      );
    }

    console.log(`  Fixed: ${product.handle} (${imagesRes.rows.length} images, now positions 0..${imagesRes.rows.length - 1})`);
    fixed++;
  }

  console.log(`\nDone! Fixed ${fixed} products.`);
  await client.end();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
