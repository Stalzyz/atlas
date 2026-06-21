import { Controller, Get, Post, Put, Body, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('templates')
  getTemplates() {
    return this.invoicesService.getTemplates();
  }

  @Post('templates')
  createTemplate(@Body() data: any) {
    return this.invoicesService.createTemplate(data);
  }

  @Put('templates/:id')
  updateTemplate(@Param('id') id: string, @Body() data: any) {
    return this.invoicesService.updateTemplate(id, data);
  }

  @Get()
  getInvoices(@Query('status') status?: string) {
    return this.invoicesService.getInvoices(status);
  }

  @Get(':id')
  getInvoice(@Param('id') id: string) {
    return this.invoicesService.getInvoice(id);
  }

  @Post()
  createInvoice(@Body() data: any) {
    return this.invoicesService.createInvoice(data);
  }

  @Put(':id')
  updateInvoice(@Param('id') id: string, @Body() data: any) {
    return this.invoicesService.updateInvoice(id, data);
  }

  @Post(':id/send-email')
  sendEmail(
    @Param('id') id: string,
    @Body() body: { subject?: string; message?: string; signature?: string }
  ) {
    return this.invoicesService.sendInvoiceEmail(id, body.subject, body.message, body.signature);
  }

  @Get(':id/download')
  async downloadInvoice(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.invoicesService.generatePDF(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Invoice-${id.slice(-6)}.pdf"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
