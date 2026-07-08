import { PrismaClient } from '@atlas/database';

const localPrisma = new PrismaClient({ 
  datasources: { db: { url: 'postgresql://postgres@127.0.0.1:5432/atlas_cert' } } 
});

const remotePrisma = new PrismaClient({ 
  datasources: { db: { url: 'postgresql://atlas_user:Atlas%40Prod2024@127.0.0.1:5433/atlas' } } 
});

async function sync() {
  try {
    console.log("Testing connections...");
    await localPrisma.$connect();
    await remotePrisma.$connect();
    console.log("Connections OK.");

    console.log("Syncing Collections...");
    const collections = await localPrisma.collection.findMany();
    let cCount = 0;
    for (const c of collections) {
       await remotePrisma.collection.upsert({ where: { handle: c.handle }, create: c, update: c });
       cCount++;
    }
    console.log(`Synced ${cCount} collections.`);

    console.log("Syncing Products (this might take a minute)...");
    const products = await localPrisma.product.findMany({ 
      include: { variants: true, images: true, collections: true } 
    });
    
    let pCount = 0;
    for (const p of products) {
      const { variants, images, collections, ...productData } = p;
      await remotePrisma.product.upsert({
        where: { handle: p.handle },
        create: productData as any,
        update: productData as any
      });
      
      for (const v of variants) {
        await remotePrisma.variant.upsert({ where: { sku: v.sku }, create: v as any, update: v as any });
      }
      
      for (const i of images) {
        await remotePrisma.image.upsert({ where: { id: i.id }, create: i as any, update: i as any });
      }
      
      for (const c of collections) {
        await remotePrisma.product.update({ 
          where: { id: p.id }, 
          data: { collections: { connect: { id: c.id } } } 
        });
      }
      pCount++;
      if (pCount % 100 === 0) console.log(`Synced ${pCount} products...`);
    }
    console.log(`Synced all ${pCount} products successfully.`);
  } catch(e) {
    console.error("Sync error:", e);
  } finally {
    await localPrisma.$disconnect();
    await remotePrisma.$disconnect();
  }
}

sync();
