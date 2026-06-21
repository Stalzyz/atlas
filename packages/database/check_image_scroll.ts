import { PrismaClient } from './generated-client';

const prisma = new PrismaClient();

async function main() {
  const sections = await prisma.section.findMany({
    where: { type: 'IMAGE_SCROLL' }
  });
  console.dir(sections, { depth: null });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
