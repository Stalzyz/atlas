import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MarketingService } from './marketing.service';
import { MarketingController } from './marketing.controller';
import { CommunicationModule } from '../communication/communication.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [ScheduleModule.forRoot(), CommunicationModule, MailModule],
  controllers: [MarketingController],
  providers: [MarketingService],
  exports: [MarketingService],
})
export class MarketingModule {}
