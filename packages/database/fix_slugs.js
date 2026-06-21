const { PrismaClient } = require('./generated-client');
const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.page.findMany();
  for (const page of pages) {
    if (page.handle !== page.handle.trim() || page.title === "Page Not Found") {
      console.log(`Fixing or deleting page: '${page.handle}' | '${page.title}'`);
      
      if (page.title === "Page Not Found") {
        await prisma.page.delete({ where: { id: page.id } });
        console.log(`Deleted: '${page.handle}'`);
      } else if (page.handle !== page.handle.trim()) {
        const newHandle = page.handle.trim().replace(/\s+/g, '-').toLowerCase();
        console.log(`Renaming: '${page.handle}' -> '${newHandle}'`);
        
        // Delete any existing page with the new handle to avoid Unique constraint error
        const existing = await prisma.page.findUnique({ where: { handle: newHandle } });
        if (existing) {
           await prisma.page.delete({ where: { handle: newHandle } });
        }
        
        await prisma.page.update({
          where: { id: page.id },
          data: { handle: newHandle }
        });
      }
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
