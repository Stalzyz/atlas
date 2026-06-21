import * as request from 'supertest';
import { initApp, closeApp, resetDatabase } from '../setup';
import { getAuthToken } from '../utils/auth';

describe('Products (e2e)', () => {
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

  it('/products (POST) - should create a product successfully', async () => {
    const res = await request(server)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Premium Silk Kurti',
        price: 2499,
        description: 'Handcrafted silk kurti with gold embroidery',
        type: 'Ethnic Wear',
        published: true
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Premium Silk Kurti');
    expect(res.body.handle).toBe('premium-silk-kurti');
    expect(res.body.variants).toHaveLength(1);
  });

  it('/products (GET) - should fetch all published products', async () => {
    // Create a product first
    await request(server)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Product 1', price: 100, published: true });

    const res = await request(server).get('/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('/products/:id (DELETE) - should delete a product', async () => {
    const createRes = await request(server)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'To Be Deleted', price: 100 });

    const productId = createRes.body.id;

    const deleteRes = await request(server)
      .delete(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.status).toBe(200);

    const findRes = await request(server).get(`/products/to-be-deleted`);
    expect(findRes.status).toBe(404);
  });
});
