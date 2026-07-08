import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const template = await prisma.emailTemplate.findFirst({
    where: { type: "PAYMENT_FAILED" }
  });

  if (template) {
    const newBody = template.body.replace("https://atlas.grekam.in/checkout/retry/{{orderId}}", "https://atlas.grekam.in/checkout");
    await prisma.emailTemplate.update({
      where: { id: template.id },
      data: { body: newBody }
    });
    console.log("Successfully updated PAYMENT_FAILED template link.");
  } else {
    console.log("PAYMENT_FAILED template not found.");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
