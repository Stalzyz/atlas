const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  const menus = await prisma.menu.findMany({ include: { items: true } });
  console.log(JSON.stringify(menus, null, 2));
}
fix().finally(() => prisma.$disconnect());
