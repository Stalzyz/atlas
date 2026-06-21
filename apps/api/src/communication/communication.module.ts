import { Module, Global } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { GraftyService } from './grafty.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [CommunicationService, GraftyService],
  exports: [CommunicationService, GraftyService],
})
export class CommunicationModule {}
