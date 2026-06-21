const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
  console.log("Total orders in DB:", await prisma.order.count());
  console.log("Recent 5 orders:");
  orders.forEach(o => console.log(`- ID: ${o.id}, Status: ${o.status}, UserID: ${o.userId}, Email: ${o.customerEmail}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
