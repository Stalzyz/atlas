import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as cookieParser from 'cookie-parser';

let app: INestApplication;
let prisma: PrismaService;

export const initApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  
  // Apply the same global middleware as your real app
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  
  await app.init();
  prisma = app.get<PrismaService>(PrismaService);
  
  return { app, server: app.getHttpServer(), prisma };
};

export const resetDatabase = async (prisma: PrismaService) => {
  // Truncate all tables in the correct order to avoid foreign key violations
  const tableNames = [
    'OrderItem', 'Order', 'CartItem', 'Cart', 'Review', 
    'ProductImage', 'ProductVariant', 'Product', 'Category',
    'User', 'Role'
  ];
  
  for (const tableName of tableNames) {
    try {
      await (prisma as any)[tableName.toLowerCase()].deleteMany();
    } catch (e) {
      // Some tables might not exist yet or have different names, skipping
    }
  }
};

export const closeApp = async () => {
  if (app) {
    await app.close();
  }
};
