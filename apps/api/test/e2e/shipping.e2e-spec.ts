import * as request from 'supertest';
import { initApp, closeApp, resetDatabase } from '../setup';
import { getAuthToken } from '../utils/auth';

describe('Shipping & Logistics (e2e)', () => {
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

  it('Shipping Lifecycle: Options → Fulfillment → Shipment → Track', async () => {
    // 1. Check Shipping Options
    const optionsRes = await request(server)
      .get('/logistics/shipping-options')
      .query({ state: 'Tamil Nadu', total: '2500' });

    expect(optionsRes.status).toBe(200);
    expect(Array.isArray(optionsRes.body)).toBe(true);

    // 2. Setup: Create an order to fulfill
    const order = await prisma.order.create({
      data: {
        customerName: 'Logistics Test',
        customerEmail: 'test@shipping.com',
        customerPhone: '1122334455',
        totalAmount: 2500,
        shippingAddress: { city: 'Chennai' },
        status: 'CONFIRMED'
      }
    });

    // 3. Create Fulfillment (Packing)
    const fulfillmentRes = await request(server)
      .post('/logistics/fulfillment')
      .set('Authorization', `Bearer ${token}`)
      .send({
        orderId: order.id,
        items: [] // Empty means all items for this test
      });

    expect(fulfillmentRes.status).toBe(201);
    const fulfillmentId = fulfillmentRes.body.id;

    // 4. Create Shipment (Shipping)
    const shipmentRes = await request(server)
      .post('/logistics/shipment')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fulfillmentId,
        courierId: 'manual',
        trackingId: 'TRK-ATLAS-123',
        estimatedDelivery: new Date(Date.now() + 86400000 * 3).toISOString()
      });

    expect(shipmentRes.status).toBe(201);

    // 5. Customer Tracking
    const trackingRes = await request(server)
      .get('/logistics/tracking/TRK-ATLAS-123');

    expect(trackingRes.status).toBe(200);
    expect(trackingRes.body.trackingId).toBe('TRK-ATLAS-123');
  });
});
