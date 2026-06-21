import { Test, TestingModule } from '@nestjs/testing';
import { MigrationService } from './migration.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MigrationService (Unit)', () => {
  let service: MigrationService;
  let prisma: PrismaService;

  const mockPrisma = {
    product: {
      upsert: jest.fn().mockResolvedValue({ id: 'prod_1', handle: 'test-saree' }),
      update: jest.fn().mockResolvedValue({}),
    },
    collection: {
      upsert: jest.fn().mockResolvedValue({ id: 'coll_1', handle: 'silk-sarees', title: 'Silk Sarees' }),
    },
    variant: {
      findUnique: jest.fn().mockResolvedValue(null),
      upsert: jest.fn().mockResolvedValue({}),
    },
    image: {
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue({}),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MigrationService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<MigrationService>(MigrationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process migration and call prisma upsert for products', async () => {
    // Mock global fetch
    global.fetch = jest.fn().mockImplementation((url) => {
      if (url.includes('count.json')) return Promise.resolve({ ok: true, json: () => Promise.resolve({ count: 1 }) });
      if (url.includes('products.json')) return Promise.resolve({
        ok: true,
        headers: new Map([['link', '']]),
        json: () => Promise.resolve({
          products: [{
            id: 1,
            title: 'Test Saree',
            handle: 'test-saree',
            product_type: 'Silk Sarees',
            variants: [{ id: 101, sku: 'TS-001', price: '1000' }],
            options: [{ name: 'Size' }],
            images: []
          }]
        })
      });
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    }) as any;

    // We need to call the private processMigration or startMigration
    // Since startMigration is public and calls processMigration in background, 
    // we'll use a hack to wait for the background process if we want to test startMigration,
    // or just call processMigration directly if we cast to any.
    
    await (service as any).processMigration('test.myshopify.com', 'token');

    expect(prisma.product.upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { handle: 'test-saree' }
    }));
    
    expect(prisma.collection.upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { handle: 'silk-sarees' }
    }));
  });
});
