import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { WholesalePdfService } from '../wholesale/wholesale-pdf.service';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService, WholesalePdfService],
})
export class InvoicesModule {}
