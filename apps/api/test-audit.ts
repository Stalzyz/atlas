import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PaymentsService } from './src/payments/payments.service';
import { PrismaService } from './src/prisma/prisma.service';

async function runAudit() {
  console.log('🚀 Bootstrapping NestJS Application Context for Audit...');
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const paymentsService = app.get(PaymentsService);
  const prisma = app.get(PrismaService);

  console.log('✅ Context loaded.');

  // ─── SETUP API INTEGRATION TEST ───
  console.log('\n--- 1. SETTING UP CHECKOUT SIMULATION ---');
  // Find a product variant
  const variant = await prisma.variant.findFirst({
    where: { inventory: { gt: 10 } },
    include: { product: true }
  });

  if (!variant) {
    console.error('No variant found to test.');
    process.exit(1);
  }

  // Find or create a user with a wallet
  let user = await prisma.user.findFirst({
    include: { wallet: true }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'audit@example.com',
        name: 'Audit User',
        wallet: { create: { balance: 0 } }
      },
      include: { wallet: true }
    });
  }

  const payload = {
    items: [{ variantId: variant.id, quantity: 1 }],
    customerInfo: { name: 'Audit User', email: user.email, phone: '9999999999' },
    shippingAddress: { line1: 'Test', city: 'Test', state: 'Test', zip: '00000', country: 'IN' },
    billingAddress: { line1: 'Test', city: 'Test', state: 'Test', zip: '00000', country: 'IN' },
    gateway: 'RAZORPAY',
    useWalletCredits: false,
    shippingMethodId: undefined,
  };

  try {
    console.log('\n--- 2. TRIGGERING CREATE CHECKOUT SESSION ---');
    // @ts-ignore - simulating internal payload structure
    payload.userId = user.id; 
    
    const intentResult = await paymentsService.createCheckoutSession(payload as any);
    
    console.log('✅ Checkout Session Created Successfully.');
    console.log('Provider Order ID:', intentResult.providerOrderId);
    console.log('Net Payable:', intentResult.netPayable);

    // Verify Stock was reserved
    const reservation = await prisma.stockReservation.findFirst({
      where: { orderIntentId: intentResult.providerOrderId }
    });

    if (reservation) {
      console.log('✅ Stock Reservation Confirmed. ID:', reservation.id);
    } else {
      console.error('❌ Missing Stock Reservation!');
    }

    // Now simulate Webhook success
    console.log('\n--- 3. SIMULATING SUCCESSFUL WEBHOOK ---');
    await paymentsService.verifyAndConfirmOrder({
      providerOrderId: intentResult.providerOrderId,
      signature: 'TEST_SIGNATURE_SKIP',
      paymentId: 'pay_TEST123',
      gateway: 'RAZORPAY'
    });

    console.log('✅ Webhook Processed Successfully.');

    // Verify Order Status and Ledger
    const order = await prisma.order.findUnique({
      where: { id: intentResult.orderId },
      include: { items: true, activities: true }
    });

    if (order?.status === 'PROCESSING') {
      console.log('✅ Order Status changed to PROCESSING automatically.');
    } else {
      console.error('❌ Order Status is incorrect:', order?.status);
    }

    const ledger = await prisma.ledgerEntry.findFirst({
      where: { referenceId: intentResult.orderId }
    });

    if (ledger) {
      console.log('✅ Ledger Entry Created for Sale.');
    } else {
      console.error('❌ Missing Ledger Entry!');
    }

  } catch (err: any) {
    console.error('❌ Integration Test Failed:', err.message);
  }

  await app.close();
  process.exit(0);
}

runAudit().catch(err => {
  console.error('Audit crashed:', err);
  process.exit(1);
});
