import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { PurchaseStatus } from '@atlas/database';
import { AuthGuard } from '../auth/auth.guard';

@Controller('procurement')
@UseGuards(AuthGuard)
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  // Suppliers
  @Get('suppliers')
  getAllSuppliers() {
    return this.procurementService.getAllSuppliers();
  }

  @Get('suppliers/:id')
  getSupplierById(@Param('id') id: string) {
    return this.procurementService.getSupplierById(id);
  }

  @Post('suppliers')
  createSupplier(@Body() data: any) {
    return this.procurementService.createSupplier(data);
  }

  @Put('suppliers/:id')
  updateSupplier(@Param('id') id: string, @Body() data: any) {
    return this.procurementService.updateSupplier(id, data);
  }

  @Delete('suppliers/:id')
  deleteSupplier(@Param('id') id: string) {
    return this.procurementService.deleteSupplier(id);
  }

  // Purchase Orders
  @Get('orders')
  getAllOrders() {
    return this.procurementService.getAllPurchaseOrders();
  }

  @Get('orders/:id')
  getOrderById(@Param('id') id: string) {
    return this.procurementService.getPurchaseOrderById(id);
  }

  @Post('orders')
  createOrder(@Body() data: any) {
    return this.procurementService.createPurchaseOrder(data);
  }

  @Put('orders/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: PurchaseStatus
  ) {
    return this.procurementService.updatePOStatus(id, status);
  }
}
