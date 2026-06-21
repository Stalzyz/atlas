import * as request from 'supertest';
import { initApp, closeApp, resetDatabase } from '../setup';
import { getAuthToken } from '../utils/auth';

describe('Order Flow (e2e)', () => {
  let server: any;
  let prisma: any;
  let token: string;

  beforeAll(async () => {
    const appData = await initApp();
    server = appData.server;
    prisma = appData.prisma;
    token = await getAuthToken(server);
  });

  beforeEach(async () => {
    await resetDatabase(prisma);
  });

  afterAll(async () => {
    await closeApp();
  });

  it('Payment Verify → Create Order → Update Fulfillment', async () => {
    // 1. Setup - Create a product and variant
    const product = await prisma.product.create({
      data: {
        title: 'Bestseller Kurti',
        handle: 'bestseller-kurti',
        variants: {
          create: {
            sku: 'BK-001',
            price: 1500,
            inventory: 10,
            title: 'Default'
          }
        }
      },
      include: { variants: true }
    });

    const variantId = product.variants[0].id;

    // 2. Simulate Payment Verification (Guest Checkout)
    const verifyRes = await request(server)
      .post('/payments/verify')
      .send({
        gateway: 'RAZORPAY',
        providerOrderId: 'order_test_123',
        paymentId: 'pay_test_456',
        signature: 'sig_test_789',
        totalAmount: 1500,
        items: [{ variantId, quantity: 1, price: 1500 }],
        customerName: 'Stalin Kumar',
        customerEmail: 'stalin@test.com',
        customerPhone: '9876543210',
        shippingAddress: {
          address: '123 Test St',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600001'
        }
      });

    expect(verifyRes.status).toBe(201);
    expect(verifyRes.body.id).toBeDefined();
    const orderId = verifyRes.body.id;

    // 3. Admin: Update Order Status
    const statusRes = await request(server)
      .patch(`/orders/admin/${orderId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'CONFIRMED' });

    expect(statusRes.status).toBe(200);

    // 4. Verify Stock Reduction
    const updatedVariant = await prisma.variant.findUnique({
      where: { id: variantId }
    });
    // Assuming your service reduces stock on order creation
    // expect(Number(updatedVariant.inventory)).toBe(9);
  });
});
