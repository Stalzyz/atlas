import { Module } from '@nestjs/common';
import { WholesaleController } from './wholesale.controller';
import { WholesaleService } from './wholesale.service';
import { WholesalePdfService } from './wholesale-pdf.service';
import { InventoryModule } from '../inventory/inventory.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [InventoryModule, AnalyticsModule],
  controllers: [WholesaleController],
  providers: [WholesaleService, WholesalePdfService],
  exports: [WholesaleService, WholesalePdfService],
})
export class WholesaleModule {}
