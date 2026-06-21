const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/src/app.module');
const { MigrationService } = require('./dist/src/products/migration.service');

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const migrationService = app.get(MigrationService);
  console.log("Starting migration on VPS...");
  await migrationService.startMigration('cvb1ga-1j.myshopify.com', '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');
  
  // Wait for it
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const status = migrationService.getStatus();
      console.log(`Processed: ${status.processedCount}/${status.totalProducts} | Success: ${status.successCount}`);
      if (!status.isRunning && status.processedCount > 0) {
        clearInterval(interval);
        console.log('Migration complete!');
        resolve();
      }
    }, 5000);
  }).then(() => process.exit(0));
}
run();
