const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const count = await prisma.product.count();
  console.log("Total Products in DB:", count);
  const mStatus = await prisma.themeSettings.findUnique({where: {id: 'global'}});
}
run();
