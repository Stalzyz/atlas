import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, LedgerType } from '@raaghas/database';
import { Prisma } from '@raaghas/database';
const { Decimal } = Prisma;

@Injectable()
export class LedgerService {
  constructor(private prisma: PrismaService) {}

  async getLedgerEntries(role: UserRole, filters: any) {
    const settings = await this.prisma.storeSettings.findUnique({ where: { id: 'global' } });
    
    // Accountants see all entries by default in this version
    const hideDrafts = false;

    return this.prisma.ledgerEntry.findMany({
      where: {
        ...(hideDrafts ? { isDraft: false } : {}),
        ...(filters.type && { type: filters.type as LedgerType }),
        ...((filters.startDate || filters.endDate) && {
          createdAt: {
            ...(filters.startDate && { gte: new Date(filters.startDate) }),
            ...(filters.endDate && { lte: new Date(new Date(filters.endDate).setHours(23, 59, 59, 999)) }),
          },
        }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createEntry(data: any, tx?: any) {
    const client = tx || this.prisma;
    return client.ledgerEntry.create({
      data: {
        ...data,
        amount: new Decimal(data.amount),
        taxableValue: data.taxableValue ? new Decimal(data.taxableValue) : null,
        cgst: data.cgst ? new Decimal(data.cgst) : null,
        sgst: data.sgst ? new Decimal(data.sgst) : null,
        igst: data.igst ? new Decimal(data.igst) : null,
        totalTax: data.totalTax ? new Decimal(data.totalTax) : null,
      },
    });
  }

  async getSummary(role: UserRole, startDate: string, endDate: string) {
    const entries = await this.getLedgerEntries(role, { startDate, endDate });
    
    const summary = {
      totalSales: new Decimal(0),
      totalPurchases: new Decimal(0),
      totalRefunds: new Decimal(0),
      netRevenue: new Decimal(0),
    };

    entries.forEach(entry => {
      const amt = new Decimal(entry.amount);
      if (entry.type === LedgerType.SALE) summary.totalSales = summary.totalSales.add(amt);
      if (entry.type === LedgerType.PURCHASE) summary.totalPurchases = summary.totalPurchases.add(amt);
      if (entry.type === LedgerType.REFUND) summary.totalRefunds = summary.totalRefunds.add(amt);
    });

    summary.netRevenue = summary.totalSales.minus(summary.totalPurchases).minus(summary.totalRefunds);
    
    return summary;
  }
}
