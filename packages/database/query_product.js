const { PrismaClient } = require('./generated-client');
const prisma = new PrismaClient();
async function main() {
  const p = await prisma.product.findMany({ where: { handle: { contains: 'varnik' } }, include: { variants: true } });
  console.log(JSON.stringify(p, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
