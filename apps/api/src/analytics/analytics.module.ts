import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { LedgerService } from './ledger.service';
import { LedgerController } from './ledger.controller';

@Module({
  controllers: [AnalyticsController, LedgerController],
  providers: [AnalyticsService, LedgerService],
  exports: [LedgerService],
})
export class AnalyticsModule {}
