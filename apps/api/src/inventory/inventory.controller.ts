import { Controller, Get, Patch, Body, Post, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('inventory')
@UseGuards(AuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('radar')
  getRadar() {
    return this.inventoryService.getInventoryRadar();
  }

  @Get('grid')
  getGrid() {
    return this.inventoryService.getInventoryGrid();
  }

  @Patch('adjust')
  adjustStock(@Body() body: { variantId: string; change: number; type: any; notes?: string }) {
    return this.inventoryService.adjustStock(body);
  }

  @Post('reservations/cleanup')
  cleanupReservations() {
    return this.inventoryService.clearExpiredReservations();
  }
}
