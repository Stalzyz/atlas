import { PrismaClient } from '@repo/database';
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.product.count({ where: { NOT: { shopifyId: null } } });
  console.log('Shopify Products Count:', count);
}
main();
