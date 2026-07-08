import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { InventoryService } from './src/inventory/inventory.service';
import { PrismaService } from './src/prisma/prisma.service';

async function bootstrap() {
  console.log('🚀 Bootstrapping NestJS Application Context for Stock Warning Test...');
  const app = await NestFactory.createApplicationContext(AppModule);

  const inventoryService = app.get(InventoryService);
  const prismaService = app.get(PrismaService);

  console.log('--- 1. SEEDING TEMPLATE IN DATABASE ---');
  await prismaService.emailTemplate.upsert({
    where: { type: 'ADMIN_LOW_STOCK_ALERT' },
    update: {
      name: 'Admin: Low Stock Alert',
      subject: '⚠️ Daily Stock Warning: {{criticalCount}} Critical, {{lowCount}} Low',
      body: `<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);"><div style="background-color: #ea580c; padding: 30px; text-align: center;"><img src="https://api.grekam.in/uploads/9b5b8ab107e16fb3a18c5757abd7dfb79.webp" alt="Atlas Logo" style="display: block; max-height: 50px; margin: 0 auto 20px auto;"><h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Daily Stock Warning</h1></div><div style="padding: 40px 30px; color: #333333;"><p style="font-size: 16px; margin-top: 0;">Hello Admin,</p><p style="font-size: 16px; line-height: 1.6;">This is your daily inventory digest. Some of your products require immediate attention.</p><div style="display: flex; gap: 15px; margin: 25px 0;"><div style="flex: 1; background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px;"><p style="margin: 0; font-size: 13px; color: #7f1d1d; text-transform: uppercase; font-weight: bold;">Critical / Out of Stock</p><p style="margin: 5px 0 0 0; font-size: 24px; color: #dc2626; font-weight: bold;">{{criticalCount}}</p></div><div style="flex: 1; background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 15px;"><p style="margin: 0; font-size: 13px; color: #9a3412; text-transform: uppercase; font-weight: bold;">Low Stock</p><p style="margin: 5px 0 0 0; font-size: 24px; color: #ea580c; font-weight: bold;">{{lowCount}}</p></div></div><p style="font-size: 16px; line-height: 1.6;">Below are the most urgent alerts:</p><table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;"><thead><tr style="background: #f9f9f9; border-bottom: 2px solid #eee;"><th style="padding: 10px; text-align: left; color: #555;">Product</th><th style="padding: 10px; text-align: left; color: #555;">SKU</th><th style="padding: 10px; text-align: right; color: #555;">Status</th></tr></thead><tbody>{{alertsHtml}}</tbody></table><div style="text-align: center; margin-top: 30px;"><a href="https://admin.grekam.in/products/inventory" style="display: inline-block; background-color: #ea580c; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: bold;">Manage Inventory</a></div></div><div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 13px; color: #777777;"><p style="margin: 0;">&copy; 2026 Atlas Admin Notifications.</p></div></div>`,
      isActive: true,
    },
    create: {
      type: 'ADMIN_LOW_STOCK_ALERT',
      name: 'Admin: Low Stock Alert',
      subject: '⚠️ Daily Stock Warning: {{criticalCount}} Critical, {{lowCount}} Low',
      body: `<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);"><div style="background-color: #ea580c; padding: 30px; text-align: center;"><img src="https://api.grekam.in/uploads/9b5b8ab107e16fb3a18c5757abd7dfb79.webp" alt="Atlas Logo" style="display: block; max-height: 50px; margin: 0 auto 20px auto;"><h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Daily Stock Warning</h1></div><div style="padding: 40px 30px; color: #333333;"><p style="font-size: 16px; margin-top: 0;">Hello Admin,</p><p style="font-size: 16px; line-height: 1.6;">This is your daily inventory digest. Some of your products require immediate attention.</p><div style="display: flex; gap: 15px; margin: 25px 0;"><div style="flex: 1; background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px;"><p style="margin: 0; font-size: 13px; color: #7f1d1d; text-transform: uppercase; font-weight: bold;">Critical / Out of Stock</p><p style="margin: 5px 0 0 0; font-size: 24px; color: #dc2626; font-weight: bold;">{{criticalCount}}</p></div><div style="flex: 1; background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 15px;"><p style="margin: 0; font-size: 13px; color: #9a3412; text-transform: uppercase; font-weight: bold;">Low Stock</p><p style="margin: 5px 0 0 0; font-size: 24px; color: #ea580c; font-weight: bold;">{{lowCount}}</p></div></div><p style="font-size: 16px; line-height: 1.6;">Below are the most urgent alerts:</p><table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;"><thead><tr style="background: #f9f9f9; border-bottom: 2px solid #eee;"><th style="padding: 10px; text-align: left; color: #555;">Product</th><th style="padding: 10px; text-align: left; color: #555;">SKU</th><th style="padding: 10px; text-align: right; color: #555;">Status</th></tr></thead><tbody>{{alertsHtml}}</tbody></table><div style="text-align: center; margin-top: 30px;"><a href="https://admin.grekam.in/products/inventory" style="display: inline-block; background-color: #ea580c; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: bold;">Manage Inventory</a></div></div><div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 13px; color: #777777;"><p style="margin: 0;">&copy; 2026 Atlas Admin Notifications.</p></div></div>`,
      isActive: true,
    }
  });
  console.log('✅ Template seeded.');

  console.log('--- 2. TRIGGERING DAILY CRON JOB ---');
  await inventoryService.sendDailyStockDigest();

  console.log('--- 3. VERIFYING NOTIFICATION LOG ---');
  const latestLog = await prismaService.notificationLog.findFirst({
    where: { type: 'ADMIN_LOW_STOCK_ALERT' },
    orderBy: { createdAt: 'desc' },
  });

  if (latestLog) {
    console.log('✅ Notification Logged:', {
      id: latestLog.id,
      recipient: latestLog.recipient,
      status: latestLog.status,
      error: latestLog.error,
    });
  } else {
    console.log('❌ No notification log found for ADMIN_LOW_STOCK_ALERT.');
  }

  await app.close();
}

bootstrap()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Integration Test Failed:', err.message || err);
    process.exit(1);
  });
