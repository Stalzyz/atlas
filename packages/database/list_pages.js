const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const pages = await prisma.page.findMany();
  console.log(pages.map(p => ({ handle: p.handle, title: p.title, status: p.status })));
}
main().catch(console.error).finally(() => prisma.$disconnect());
