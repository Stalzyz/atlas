import { PrismaClient } from '@atlas/database';
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.product.count();
  const latest = await prisma.product.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { variants: true } });
  console.log(JSON.stringify({ count, latest }, null, 2));
}
main().finally(() => prisma.$disconnect());
