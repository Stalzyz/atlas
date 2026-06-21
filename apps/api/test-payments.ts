import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PaymentsService } from './src/payments/payments.service';
import { PrismaService } from './src/prisma/prisma.service';

async function runTest() {
  console.log('Bootstrapping NestJS Context...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const paymentsService = app.get(PaymentsService);
  const prisma = app.get(PrismaService);

  // Mock Razorpay instance
  (paymentsService as any).getRazorpayInstance = async () => ({
    orders: {
      create: async (data: any) => ({
        id: 'order_test_rzp_' + Date.now(),
        amount: data.amount,
        status: 'created'
      })
    }
  });

  console.log('Fetching a valid variant...');
  const variant = await (prisma as any).variant.findFirst({
    where: { product: { published: true } },
    include: { product: true }
  });

  if (!variant) {
    console.error('No valid variant found!');
    await app.close();
    return;
  }

  console.log(`Selected Variant: ${variant.sku || variant.id}, Price: ${variant.price}`);

  console.log('\n--- 1. Testing Create Checkout Intent ---');
  let createResponse;
  try {
    createResponse = await paymentsService.createCheckoutSession({
      items: [{ variantId: variant.id, quantity: 1 }],
      shippingAddress: {
        firstName: 'Test',
        lastName: 'User',
        address1: '123 Test St',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500034',
        country: 'IN'
      },
      customerInfo: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+919999999999'
      },
      gateway: 'RAZORPAY',
      clerkId: 'test_user_id'
    });
    console.log('Create Intent Success:', createResponse);
  } catch (err: any) {
    console.error('Failed to create intent:', err.message);
    await app.close();
    return;
  }

  const providerOrderId = createResponse.providerOrderId;
  const dbOrderId = createResponse.orderId;
  console.log(`\n--- 2. Checking DB for pending order: ${dbOrderId} ---`);
  
  let order = await (prisma as any).order.findFirst({ where: { id: dbOrderId } });
  console.log(`Order Status before verification: ${order?.status}`);

  console.log(`\n--- 3. Testing Verify & Confirm (Webhook Simulation) ---`);
  
  // Generate correct signature
  const crypto = require('crypto');
  const validSignature = crypto.createHmac('sha256', 'dummy_secret_12345')
    .update(`${providerOrderId}|pay_test12345`)
    .digest('hex');

  try {
    const verifyResponse = await paymentsService.verifyAndConfirmOrder({
      providerOrderId: providerOrderId,
      gateway: 'RAZORPAY',
      paymentId: 'pay_test12345',
      signature: validSignature
    });
    console.log('Verify Response:', verifyResponse);
  } catch (err: any) {
    console.log('Verification failed:', err.message);
    
    // Simulate webhook handling directly by bypassing signature if verifyAndConfirm fails
    console.log('\nSimulating direct webhook confirm (admin bypass)...');
    try {
      const confirmResp = await paymentsService.adminVerifyOrder(dbOrderId);
      console.log('Admin Verify Response:', confirmResp);
    } catch (adminErr: any) {
      console.error('Admin Verify Failed:', adminErr.message);
    }
  }

  console.log('\n--- 4. Checking Final Order Status in DB ---');
  order = await (prisma as any).order.findFirst({ where: { id: dbOrderId } });
  console.log(`Final Order Status: ${order?.status}`);

  await app.close();
}

runTest().catch(console.error);
