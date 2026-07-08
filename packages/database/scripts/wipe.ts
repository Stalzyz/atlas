import { PrismaClient } from '@atlas/database';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 INITIATING DEEP WIPEOUT OF DUMMY DATA...');

  await prisma.$transaction(async (tx: any) => {
    // 1. Transactional Data (Orders & Logistics)
    console.log('Deleting Logistics...');
    await tx.shipment.deleteMany({});
    await tx.fulfillment.deleteMany({});
    console.log('Deleting Orders...');
    await tx.orderItem.deleteMany({});
    await tx.order.deleteMany({});
    await tx.orderReturn.deleteMany({});
    
    // 2. Inventory & Feedback
    console.log('Deleting Stock Logs and Reviews...');
    await tx.stockLog.deleteMany({});
    await tx.wishlistItem.deleteMany({});
    await tx.review.deleteMany({});
    
    // 3. Product Data
    console.log('Deleting Products and Variants...');
    await tx.image.deleteMany({});
    await tx.variant.deleteMany({});
    await tx.product.deleteMany({});
    
    // 4. Categorization
    console.log('Deleting Collections...');
    await tx.collection.deleteMany({});
  });

  console.log('✅ WIPE COMPLETE! Database is pristine for Shopify Migration.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
