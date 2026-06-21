import { Module, forwardRef } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { WebhookQueueService } from './webhook-queue.service';
import { MarketingModule } from '../marketing/marketing.module';
import { InventoryModule } from '../inventory/inventory.module';
import { GrowthModule } from '../growth/growth.module';
import { OrdersModule } from '../orders/orders.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [MarketingModule, InventoryModule, GrowthModule, forwardRef(() => OrdersModule), AnalyticsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, WebhookQueueService],
  exports: [PaymentsService, WebhookQueueService],
})
export class PaymentsModule {}
