import { Controller, Get, Post, Body, Query, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@raaghas/database';
import { LedgerService } from './ledger.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('analytics/ledger')
@UseGuards(AuthGuard, RolesGuard)
export class LedgerController {
  constructor(
    private ledgerService: LedgerService,
    private prisma: PrismaService
  ) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.FINANCE)
  async getLedger(@Req() req: any, @Query() query: any) {
    const user = await this.prisma.user.findUnique({ where: { id: req.user.sub } });
    if (!user) throw new UnauthorizedException('User not found in local database');
    return this.ledgerService.getLedgerEntries(user.role, query);
  }

  @Get('summary')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.FINANCE)
  async getSummary(@Req() req: any, @Query('startDate') start: string, @Query('endDate') end: string) {
    const user = await this.prisma.user.findUnique({ where: { id: req.user.sub } });
    if (!user) throw new UnauthorizedException('User not found in local database');
    return this.ledgerService.getSummary(user.role, start, end);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async createEntry(@Body() body: { 
    type: string; 
    amount: number; 
    referenceId?: string; 
    partyName?: string; 
    notes?: string; 
    isDraft?: boolean;
    taxableValue?: number;
    cgst?: number;
    sgst?: number;
    igst?: number;
    totalTax?: number;
  }) {
    return this.ledgerService.createEntry(body);
  }
}
