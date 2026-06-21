const { PrismaClient } = require('./node_modules/.prisma/client');
const prisma = new PrismaClient();
prisma.order.groupBy({
  by: ['status'],
  _count: { status: true }
}).then(console.log).then(() => process.exit(0));
