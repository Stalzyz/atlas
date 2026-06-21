import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { OrdersService, OrderStatus } from './src/orders/orders.service';
import { PrismaService } from './src/prisma/prisma.service';
import { LogisticsService } from './src/logistics/logistics.service';

async function runTest() {
  console.log('Bootstrapping NestJS Context...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const ordersService = app.get(OrdersService);
  const logisticsService = app.get(LogisticsService);
  const prisma = app.get(PrismaService);

  // Use the order ID from our last E2E test, or find any CONFIRMED order
  console.log('\n--- 1. Locating a CONFIRMED Order ---');
  let order = await (prisma as any).order.findFirst({
    where: { status: 'CONFIRMED' },
    include: { items: true, fulfillments: true }
  });

  if (!order) {
    console.error('No CONFIRMED order found. Let us create a mock CONFIRMED order for testing...');
    // Create a mock order if none exist
    const variant = await (prisma as any).variant.findFirst();
    if (!variant) throw new Error('No variants in DB');

    order = await (prisma as any).order.create({
      data: {
        id: 'RAAGHAS-TEST-FULFILL-' + Date.now(),
        customerName: 'Test Fulfillment',
        customerEmail: 'test.fulfillment@example.com',
        customerPhone: '+919999999999',
        totalAmount: 1000,
        status: 'CONFIRMED',
        paymentMethod: 'TEST',
        paymentId: 'pay_test',
        financialStatus: 'paid',
        shippingAddress: {
          firstName: 'Test',
          lastName: 'Fulfillment',
          address1: '123 Warehouse St',
          city: 'Hyderabad',
          state: 'Telangana',
          country: 'IN',
          pincode: '500034'
        },
        items: {
          create: [{
            variantId: variant.id,
            quantity: 1,
            price: 1000
          }]
        }
      },
      include: { items: true, fulfillments: true }
    });
  }

  console.log(`Using Order: ${order.id}`);
  console.log(`Initial Order Status: ${order.status}`);
  console.log(`Initial Fulfillment Status: ${order.fulfillmentStatus || 'UNFULFILLED'}`);

  console.log('\n--- 2. Checking Pre-Fulfillment Inventory ---');
  const items = order.items;
  const variantId = items[0].variantId;
  
  let variant = await (prisma as any).variant.findUnique({ where: { id: variantId } });
  console.log(`Variant ${variantId} pre-fulfillment inventory: ${variant.inventory}`);
  
  const reservations = await (prisma as any).stockReservation.count({
    where: { orderId: order.id, variantId: variantId }
  });
  console.log(`Active Reservations for this order: ${reservations}`);

  console.log('\n--- 3. Triggering Fulfillment ---');
  // In the real flow, Admin UI POSTs to /orders/admin/:id/fulfillments -> ordersService.createFulfillment
  try {
    const fulfillment = await ordersService.createFulfillment(order.id, {
      carrierName: 'Delhivery',
      trackingId: 'AWB' + Date.now(),
      items: [{ variantId: variantId, quantity: items[0].quantity }]
    });
    console.log('Fulfillment successfully created:', fulfillment.id);
  } catch (err: any) {
    console.error('Failed to create fulfillment:', err.message);
  }

  console.log('\n--- 4. Verifying Post-Fulfillment State ---');
  order = await (prisma as any).order.findUnique({ where: { id: order.id } });
  console.log(`Final Order Status: ${order.status} (Expected: SHIPPED)`);
  console.log(`Final Fulfillment Status: ${order.fulfillmentStatus} (Expected: fulfilled)`);

  console.log('\n--- 5. Verifying Inventory Adjustments ---');
  const postVariant = await (prisma as any).variant.findUnique({ where: { id: variantId } });
  console.log(`Variant post-fulfillment inventory: ${postVariant.inventory} (Should be decremented)`);
  
  const postReservations = await (prisma as any).stockReservation.count({
    where: { orderId: order.id, variantId: variantId }
  });
  console.log(`Active Reservations remaining: ${postReservations} (Should be 0)`);

  const stockLogs = await (prisma as any).stockLog.findMany({
    where: { referenceId: order.id },
    orderBy: { createdAt: 'desc' }
  });
  console.log('Stock Logs generated for this order:', stockLogs.map((l: any) => ({
    type: l.type, change: l.change, newBalance: l.newBalance
  })));

  await app.close();
}

runTest().catch(console.error);
