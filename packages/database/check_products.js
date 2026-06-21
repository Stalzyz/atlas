const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const count = await prisma.product.count();
  console.log('Total products:', count);
  const products = await prisma.product.findMany({ take: 2 });
  console.log(products);
}

check().catch(console.error).finally(() => prisma.$disconnect());
