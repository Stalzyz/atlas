const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, totalAmount: true, status: true, paymentMethod: true, createdAt: true, paymentIntentId: true } });
  console.log(orders);
}
main().catch(console.error).finally(() => prisma.$disconnect());
