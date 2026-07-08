import * as request from 'supertest';
import { initApp, closeApp, resetDatabase } from '../setup';
import { getAuthToken } from '../utils/auth';

describe('CMS (e2e)', () => {
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

  it('/cms/sync (POST) - should atomically sync page and theme state', async () => {
    const res = await request(server)
      .post('/cms/sync')
      .set('Authorization', `Bearer ${token}`)
      .send({
        page: {
          handle: 'home',
          title: 'Atlas Home',
          sections: [
            { type: 'HERO', order: 0, content: { heading: 'Welcome' } }
          ]
        },
        theme: {
          storeName: 'Test Store',
          config: { light_primaryColor: '#FF0000' }
        }
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

    // Verify DB state
    const page = await prisma.page.findUnique({ where: { handle: 'home' }, include: { sections: true } });
    expect(page.sections).toHaveLength(1);
    
    const theme = await prisma.themeSettings.findUnique({ where: { id: 'global' } });
    expect(theme.storeName).toBe('Test Store');
    expect(theme.primaryColor).toBe('#FF0000');
  });

  it('/cms/theme (GET) - should retrieve theme settings with defaults', async () => {
    const res = await request(server).get('/cms/theme');
    expect(res.status).toBe(200);
    expect(res.body.storeName).toBeDefined();
    expect(res.body.config).toBeDefined();
  });

  it('/cms/pages (GET) - should list all pages', async () => {
    await prisma.page.create({ data: { handle: 'about', title: 'About Us' } });
    
    const res = await request(server).get('/cms/pages');
    expect(res.status).toBe(200);
    expect(res.body.some((p: any) => p.handle === 'about')).toBe(true);
  });
});
