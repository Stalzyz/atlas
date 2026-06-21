import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.page.findMany({
    select: { handle: true, metaTitle: true, metaDescription: true }
  });
  console.log(pages);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
