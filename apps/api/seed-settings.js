const { PrismaClient } = require('@atlas/database');
const prisma = new PrismaClient();

async function run() {
  await prisma.storeSettings.upsert({
    where: { id: 'global' },
    update: {
      razorpayKeyId: 'rzp_test_dummykey',
      razorpayKeySecret: 'dummy_secret_12345'
    },
    create: {
      id: 'global',
      razorpayKeyId: 'rzp_test_dummykey',
      razorpayKeySecret: 'dummy_secret_12345'
    }
  });
  console.log('Settings updated with dummy Razorpay keys!');
}

run().finally(() => prisma.$disconnect());
