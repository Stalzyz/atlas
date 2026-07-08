import * as request from 'supertest';
import { initApp, closeApp, resetDatabase } from '../setup';

// Mocking Global Fetch for Shopify API simulation
const originalFetch = global.fetch;

describe('Shopify Migration (e2e)', () => {
  let server: any;
  let prisma: any;

  beforeAll(async () => {
    const appData = await initApp();
    server = appData.server;
    prisma = appData.prisma;
  });

  beforeEach(async () => {
    await resetDatabase(prisma);
    global.fetch = originalFetch; // Restore if needed
  });

  afterAll(async () => {
    await closeApp();
    global.fetch = originalFetch;
  });

  it('Migration Lifecycle: Fetch Count → Fetch Products → Link Collections', async () => {
    // 1. Mock Shopify API Responses
    global.fetch = jest.fn().mockImplementation((url) => {
      if (url.includes('count.json')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ count: 1 })
        });
      }
      if (url.includes('products.json')) {
        return Promise.resolve({
          ok: true,
          headers: new Map([['link', '']]),
          json: () => Promise.resolve({
            products: [{
              id: 123456,
              title: 'Shopify Silk Saree',
              handle: 'shopify-silk-saree',
              body_html: 'Luxury silk saree',
              vendor: 'Atlas',
              product_type: 'Silk Sarees',
              tags: 'silk, traditional',
              variants: [{
                id: 789,
                sku: 'SP-SILK-001',
                price: '5000.00',
                inventory_quantity: 10,
                option1: 'Blue'
              }],
              options: [{ name: 'Color' }],
              images: []
            }]
          })
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    }) as any;

    // 2. Start Migration via API
    const startRes = await request(server)
      .post('/products/migration/start')
      .send({ shopUrl: 'test-store.myshopify.com', accessToken: 'shpat_test' });

    expect(startRes.status).toBe(201);
    expect(startRes.body.isRunning).toBe(true);

    // 3. Wait for Background process to finish (Polling simulation)
    // In a real E2E we'd poll /migration/status, but for this mock we can wait a tick
    await new Promise(resolve => setTimeout(resolve, 500));

    const statusRes = await request(server).get('/products/migration/status');
    expect(statusRes.body.successCount).toBe(1);

    // 4. Verify Database Persistence
    const product = await prisma.product.findUnique({
      where: { handle: 'shopify-silk-saree' },
      include: { variants: true, collections: true }
    });

    expect(product).toBeDefined();
    expect(product.shopifyId).toBe('123456');
    expect(product.variants[0].sku).toBe('SP-SILK-001');
    expect(product.collections[0].title).toBe('Silk Sarees');
  });
});
