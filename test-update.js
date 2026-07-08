const { PrismaClient } = require('@atlas/database');
const prisma = new PrismaClient({
  datasources: {
    db: { url: "postgresql://postgres:postgres@localhost:5432/atlas" }
  }
});
async function run() {
  const result = await prisma.storeSettings.update({
    where: { id: 'global' },
    data: { loyaltyMinOrderValue: 2500 }
  });
  console.log("Result loyalty:", result.loyaltyMinOrderValue);
}
run().catch(console.error);
