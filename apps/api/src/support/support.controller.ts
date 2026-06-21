import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { AuthGuard } from '../auth/auth.guard';
import { Public } from '../auth/public.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @UseGuards(AuthGuard)
  @Get('tickets')
  getTickets() {
    return this.supportService.getTickets();
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('tickets')
  createTicket(@Body() data: any) {
    return this.supportService.createTicket(data);
  }

  @UseGuards(AuthGuard)
  @Get('tickets/:id')
  getTicket(@Param('id') id: string) {
    return this.supportService.getTicket(id);
  }

  @UseGuards(AuthGuard)
  @Patch('tickets/:id/status')
  updateTicketStatus(@Param('id') id: string, @Body() data: { status: any }) {
    return this.supportService.updateTicketStatus(id, data.status);
  }
}
