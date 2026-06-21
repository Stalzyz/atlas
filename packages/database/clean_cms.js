const { PrismaClient } = require('./generated-client');
const prisma = new PrismaClient();

async function main() {
  const sections = await prisma.section.findMany();
  const badSections = sections.filter(s => JSON.stringify(s.content).includes('Ivory Cotton Kurti'));
  console.log('Found sections with dummy data:', badSections.map(s => ({ id: s.id, type: s.type })));
  
  for (const s of badSections) {
    const content = s.content;
    if (content.products) {
      delete content.products; // Erase the dummy products
      await prisma.section.update({
        where: { id: s.id },
        data: { content }
      });
      console.log(`Updated section ${s.id}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
