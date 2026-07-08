const { PrismaClient } = require('@atlas/database');
const prisma = new PrismaClient({
  datasources: { db: { url: 'postgresql://atlas_user:Atlas%40Prod2024@localhost:5432/atlas' } }
});

async function main() {
  const users = await prisma.user.findMany({ select: { email: true, savedAddresses: true }});
  console.log(JSON.stringify(users, null, 2));
}

main().finally(() => prisma.$disconnect());
