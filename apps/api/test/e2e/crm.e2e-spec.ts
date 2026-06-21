import * as request from 'supertest';
import { initApp, closeApp, resetDatabase } from '../setup';
import { getAuthToken } from '../utils/auth';

describe('CRM & Wholesale (e2e)', () => {
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

  it('Retailer Lifecycle: Register → Approve → Draft Order → Invoice', async () => {
    // 1. Create Retailer
    const retailerRes = await request(server)
      .post('/wholesale/retailers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        businessName: 'Luxe Boutique',
        contactName: 'Ananya Sharma',
        email: 'ananya@luxe.com',
        phone: '9888877777',
        gstNumber: '33AAAAA0000A1Z5'
      });

    expect(retailerRes.status).toBe(201);
    const retailerId = retailerRes.body.id;

    // 2. Approve Retailer
    const approveRes = await request(server)
      .patch(`/wholesale/retailers/${retailerId}/approve`)
      .set('Authorization', `Bearer ${token}`);

    expect(approveRes.status).toBe(200);
    expect(approveRes.body.status).toBe('ACTIVE');

    // 3. Setup Product for Wholesale
    const product = await prisma.product.create({
      data: {
        title: 'Wholesale Saree',
        handle: 'wholesale-saree',
        variants: {
          create: {
            sku: 'WS-001',
            price: 5000,
            inventory: 100,
            title: 'Default'
          }
        }
      },
      include: { variants: true }
    });

    const variantId = product.variants[0].id;

    // 4. Create Draft Order
    const orderRes = await request(server)
      .post('/wholesale/orders/draft')
      .set('Authorization', `Bearer ${token}`)
      .send({
        retailerId,
        items: [
          {
            productId: product.id,
            variantId,
            quantity: 10,
            unitMrp: 5000,
            unitWholesalePrice: 4000,
            totalPrice: 40000
          }
        ]
      });

    expect(orderRes.status).toBe(201);
    const orderId = orderRes.body.id;

    // 5. Publish Invoice
    const invoiceRes = await request(server)
      .post(`/wholesale/orders/${orderId}/invoice`)
      .set('Authorization', `Bearer ${token}`);

    expect(invoiceRes.status).toBe(201);
    expect(invoiceRes.body.isPublished).toBe(true);
  });
});
