import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const coupon = await prisma.discount.create({
    data: {
      code: "TESTDEL123",
      type: "FLAT",
      value: 100,
    }
  });
  console.log("Created", coupon.id);
  try {
    await prisma.discountUsage.deleteMany({ where: { discountId: coupon.id } });
    await prisma.discount.delete({ where: { id: coupon.id } });
    console.log("Deleted");
  } catch (err) {
    console.error("Error deleting:", err);
  }
}
main();
