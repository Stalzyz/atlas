import { Module } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { ProcurementController } from './procurement.controller';

@Module({
  imports: [],
  controllers: [ProcurementController],
  providers: [ProcurementService],
  exports: [ProcurementService],
})
export class ProcurementModule {}

