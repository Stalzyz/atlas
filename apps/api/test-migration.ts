import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { MigrationService } from './src/products/migration.service';

async function runMigration() {
  console.log('Bootstrapping NestJS Context for Migration...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const migrationService = app.get(MigrationService);

  const shopUrl = 'cvb1ga-1j.myshopify.com';
  const token = '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';

  console.log(`Starting migration for ${shopUrl}...`);
  await migrationService.startMigration(shopUrl, token);

  // Poll for completion
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const status = migrationService.getStatus();
      
      console.log(`\n[Migration Status]`);
      console.log(`Running: ${status.isRunning}`);
      console.log(`Total Products Discovered: ${status.totalProducts}`);
      console.log(`Processed: ${status.processedCount}`);
      console.log(`Success: ${status.successCount} | Skipped: ${status.skipCount} | Errors: ${status.errorCount}`);
      console.log(`Current Product: ${status.currentProduct || 'None'}`);
      
      // Print new logs
      const recentLogs = status.logs.slice(0, 3);
      console.log('Recent Logs:');
      recentLogs.forEach(l => console.log(`  [${l.time}] [${l.type.toUpperCase()}] ${l.message}`));

      if (!status.isRunning && status.processedCount > 0) {
        clearInterval(interval);
        console.log('\n✅ Migration complete!');
        resolve(true);
      }
    }, 5000); // Check every 5 seconds
  }).then(() => app.close());
}

runMigration().catch(console.error);
