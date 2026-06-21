import { PrismaClient } from '@prisma/client';

async function test() {
  const prisma = new PrismaClient();
  try {
    const products = await prisma.product.findMany({ take: 1, include: { variants: true } });
    if (!products.length) return console.log("No products");
    const p = products[0];
    
    // Simulate bulkUpdateItems logic
    const productData: any = {};
    productData.sizeGuideId = null; // or valid ID
    
    await prisma.product.update({
      where: { id: p.id },
      data: productData
    });
    
    console.log("Product updated successfully.");
    
  } catch (e) {
    console.error("Prisma Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
