const { PrismaClient } = require('./generated-client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: {
      images: true,
      variants: {
        include: {
          images: true
        }
      }
    },
    take: 3
  });

  console.log(JSON.stringify(products, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
