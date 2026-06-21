import { Module } from '@nestjs/common';
import { GrowthController } from './growth.controller';
import { GrowthService } from './growth.service';
import { SettingsModule } from '../settings/settings.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [SettingsModule, NotificationsModule],
  controllers: [GrowthController],
  providers: [GrowthService],
  exports: [GrowthService],
})
export class GrowthModule {}
