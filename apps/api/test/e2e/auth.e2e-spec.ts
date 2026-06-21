import * as request from 'supertest';
import { initApp, closeApp, resetDatabase } from '../setup';

describe('Auth (e2e)', () => {
  let server: any;
  let prisma: any;

  beforeAll(async () => {
    const appData = await initApp();
    server = appData.server;
    prisma = appData.prisma;
  });

  beforeEach(async () => {
    await resetDatabase(prisma);
  });

  afterAll(async () => {
    await closeApp();
  });

  it('/auth/login (POST) - should login successfully with correct credentials', async () => {
    // Seed an admin first
    await request(server)
      .post('/auth/seed-admin')
      .send({ email: 'admin@test.com', pass: 'password123' });

    const res = await request(server)
      .post('/auth/login')
      .send({ email: 'admin@test.com', pass: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('admin@test.com');
  });

  it('/auth/login (POST) - should fail with wrong password', async () => {
    await request(server)
      .post('/auth/seed-admin')
      .send({ email: 'admin@test.com', pass: 'password123' });

    const res = await request(server)
      .post('/auth/login')
      .send({ email: 'admin@test.com', pass: 'wrongpass' });

    expect(res.status).toBe(401);
  });
});
