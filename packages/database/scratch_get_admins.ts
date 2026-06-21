import { PrismaClient } from './generated-client/index.js';

async function main() {
  process.env.DATABASE_URL = 'postgresql://postgres@127.0.0.1:5432/raaghas_cert';
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { email: true }
  });
  console.log('Admins:', JSON.stringify(admins));
  await prisma.$disconnect();
}

main().catch(console.error);
