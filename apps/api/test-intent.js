const { PrismaClient } = require('./node_modules/.prisma/client');
const prisma = new PrismaClient();
prisma.order.findFirst({ where: { paymentId: { not: null } }, select: { paymentId: true, paymentIntentId: true } })
  .then(console.log)
  .then(() => prisma.paymentIntent.findFirst({ select: { providerOrderId: true, gateway: true, orderId: true } }))
  .then(console.log)
  .finally(() => prisma.$disconnect());
