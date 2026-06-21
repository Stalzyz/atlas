import { PrismaClient } from './generated-client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ select: { handle: true, title: true } });
  console.log(products);
}

main().finally(() => prisma.$disconnect());
