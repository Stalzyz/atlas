import { PrismaClient } from '@atlas/database';

const prisma = new PrismaClient();

async function main() {
  console.log("Prisma Models:", Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_')));
}

main().finally(() => prisma.$disconnect());
