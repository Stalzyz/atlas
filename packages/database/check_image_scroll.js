const { PrismaClient } = require('./generated-client');
const prisma = new PrismaClient();

async function main() {
  const sections = await prisma.section.findMany({
    select: {
      id: true,
      type: true,
      order: true,
      content: true,
      page: {
        select: {
          title: true,
          handle: true
        }
      }
    }
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
