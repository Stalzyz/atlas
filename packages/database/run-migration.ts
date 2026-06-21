import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const sqlContent = fs.readFileSync(path.join(__dirname, 'migrate-size-guide.sql'), 'utf-8');
  const queries = sqlContent.split(';').filter(q => q.trim().length > 0);

  for (const query of queries) {
    console.log(`Executing: ${query}`);
    await prisma.$executeRawUnsafe(query);
  }
  console.log("Migration complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
