const { PrismaClient } = require('@atlas/database');
const prisma = new PrismaClient();
async function run() {
  const count = await prisma.product.count();
  console.log("Total Products in DB:", count);
}
run();
