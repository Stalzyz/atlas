const { PrismaClient } = require('@raaghas/database');
const prisma = new PrismaClient({
  datasources: { db: { url: 'postgresql://raaghas_user:Raaghas%40Prod2024@localhost:5432/raaghas' } }
});

async function main() {
  const users = await prisma.user.findMany({ select: { email: true, savedAddresses: true }});
  console.log(JSON.stringify(users, null, 2));
}

main().finally(() => prisma.$disconnect());
