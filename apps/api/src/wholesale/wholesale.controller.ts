import {
  Controller, Get, Post, Put, Patch, Delete,
  Body, Param, Query, UseGuards, Req, Res
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { WholesaleService } from './wholesale.service';
import { WholesalePdfService } from './wholesale-pdf.service';

@Controller('wholesale')
@UseGuards(AuthGuard)
export class WholesaleController {
  constructor(
    private readonly wholesaleService: WholesaleService,
    private readonly wholesalePdfService: WholesalePdfService
  ) {}

  @Get('me')
  getMe(@Req() req: any) {
    return this.wholesaleService.getRetailerByUserId(req.user.sub);
  }

  // ─── Retailers ───────────────────────────────────────────────────────────

  @Get('retailers')
  getAllRetailers(
    @Query('status') status?: string,
    @Query('tier')   tier?:   string,
    @Query('search') search?: string,
  ) {
    return this.wholesaleService.getAllRetailers({ status, tier, search });
  }

  @Get('retailers/:id')
  getRetailer(@Param('id') id: string) {
    return this.wholesaleService.getRetailerById(id);
  }

  @Post('retailers')
  createRetailer(@Body() body: any) {
    return this.wholesaleService.createRetailer(body);
  }

  @Put('retailers/:id')
  updateRetailer(@Param('id') id: string, @Body() body: any) {
    return this.wholesaleService.updateRetailer(id, body);
  }

  @Patch('retailers/:id/approve')
  approveRetailer(@Param('id') id: string) {
    return this.wholesaleService.approveRetailer(id);
  }

  @Patch('retailers/:id/suspend')
  suspendRetailer(@Param('id') id: string) {
    return this.wholesaleService.suspendRetailer(id);
  }

  // ─── Price Lists ─────────────────────────────────────────────────────────

  @Get('price-lists')
  getAllPriceLists() {
    return this.wholesaleService.getAllPriceLists();
  }

  @Post('price-lists')
  createPriceList(@Body() body: any) {
    return this.wholesaleService.createPriceList(body);
  }

  @Put('price-lists/:id')
  updatePriceList(@Param('id') id: string, @Body() body: any) {
    return this.wholesaleService.updatePriceList(id, body);
  }

  @Delete('price-lists/:id')
  deletePriceList(@Param('id') id: string) {
    return this.wholesaleService.deletePriceList(id);
  }

  // ─── Orders ──────────────────────────────────────────────────────────────

  @Get('orders')
  getAllOrders(
    @Query('status')     status?: string,
    @Query('retailerId') retailerId?: string,
  ) {
    return this.wholesaleService.getAllOrders({ status, retailerId });
  }

  @Get('orders/:id')
  getOrder(@Param('id') id: string) {
    return this.wholesaleService.getOrderById(id);
  }

  @Post('orders/draft')
  createDraftOrder(@Body() body: any) {
    return this.wholesaleService.createDraftOrder(body);
  }

  @Patch('orders/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body() body: { status: string; advancePaid?: number }) {
    return this.wholesaleService.updateOrderStatus(id, body.status, body.advancePaid);
  }

  @Get('orders/:id/invoice')
  getWholesaleInvoice(@Param('id') id: string) {
    return this.wholesaleService.generateGSTInvoice(id);
  }

  @Post('orders/:id/invoice')
  publishWholesaleInvoice(@Param('id') id: string) {
    return this.wholesaleService.publishGSTInvoice(id);
  }

  @Post('orders/:id/send-invoice')
  sendInvoiceEmail(@Param('id') id: string, @Body() body: { subject: string; body: string; signature: string }) {
    return this.wholesaleService.sendInvoiceEmail(id, body);
  }

  @Get('orders/:id/download')
  async downloadInvoice(@Param('id') id: string, @Res() res: any) {
    const payload = await this.wholesaleService.generateGSTInvoice(id);
    const pdfBuffer = await this.wholesalePdfService.generateStyledWholesalePDF(payload);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=Raaghas_Proforma_${id.slice(0, 8).toUpperCase()}.pdf`,
      'Content-Length': pdfBuffer.length,
    });
    
    res.end(pdfBuffer);
  }
}
