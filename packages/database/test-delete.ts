import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const c = await prisma.discount.findFirst();
  if (!c) {
    console.log("No coupons found.");
    return;
  }
  try {
    await prisma.discountUsage.deleteMany({ where: { discountId: c.id } });
    await prisma.discount.delete({ where: { id: c.id } });
    console.log("Deleted");
  } catch (err) {
    console.error(err);
  }
}
main();
