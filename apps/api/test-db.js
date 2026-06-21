const { PrismaClient } = require('@raaghas/database');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ select: { email: true, savedAddresses: true }});
  console.log(JSON.stringify(users, null, 2));
}

main().finally(() => prisma.$disconnect());
