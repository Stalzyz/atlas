import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: { handle: true, title: true }
  });
  console.log(products.filter(p => p.handle.includes('ivory-cotton-kurti') || p.handle.includes('kurti')));
}

main().catch(console.error).finally(() => prisma.$disconnect());
