import { PrismaClient } from '@atlas/database';

async function main() {
  const prisma = new PrismaClient();
  await prisma.$connect();
  
  try {
    await prisma.$transaction(async (tx) => {
      console.log("In tx 1");
      await tx.$transaction(async (tx2) => {
        console.log("In tx 2");
      });
    });
  } catch (e) {
    console.error("Error:", e.message);
  }
  await prisma.$disconnect();
}
main();
