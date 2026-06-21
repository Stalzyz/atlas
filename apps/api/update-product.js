const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const collection = await prisma.collection.findUnique({
    where: { handle: 'new-in-store' }
  });

  const updated = await prisma.product.update({
    where: { id: 'cmqagnvh50001l645m70wacqg' },
    data: {
      status: 'ACTIVE',
      published: true,
      category: 'new in store', // To ensure category matching
      collections: {
        connect: { id: collection.id }
      }
    }
  });
  console.log("Updated:", updated.title, updated.status, updated.category);
}
main().catch(console.error).finally(() => prisma.$disconnect());
