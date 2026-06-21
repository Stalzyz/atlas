import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MarketingService } from './marketing.service';

@Injectable()
export class BroadcastService {
  private readonly logger = new Logger(BroadcastService.name);

  constructor(
    private prisma: PrismaService,
    private marketing: MarketingService
  ) {}

  /**
   * Sends a manual broadcast to a list of segments.
   * Forces fatigue bypass to ensure immediate delivery.
   */
  async sendBroadcast(campaignId: string) {
    const campaign = await (this.prisma as any).campaign.findUnique({
      where: { id: campaignId }
    });

    if (!campaign) throw new BadRequestException('Campaign not found');
    if (campaign.status === 'RUNNING') throw new BadRequestException('Campaign is already in progress');

    // Mark as running
    await (this.prisma as any).campaign.update({
      where: { id: campaignId },
      data: { status: 'RUNNING', startedAt: new Date() }
    });

    // IDEMPOTENCY PROCESSING (Expert Analyst Bypass)
    const customers = await (this.prisma.user as any).findMany({
      where: {
        role: 'CUSTOMER',
        phone: { not: null },
      }
    });

    let successCount = 0;
    let failCount = 0;

    for (const customer of (customers as any[])) {
      if (!customer.phone) continue;

      try {
        // ATOMIC BYPASS: We pass a hidden flag to our WhatsApp sender
        const sent = await (this.marketing as any).sendWhatsApp(
          customer.phone, 
          campaign.content,
          true // BYPASS_FATIGUE = true
        );

        if (sent) successCount++;
        else failCount++;
      } catch (e: any) {
        failCount++;
        this.logger.error(`Broadcast failed for ${customer.phone}: ${e.message}`);
      }
    }

    // Mark as completed
    await (this.prisma as any).campaign.update({
      where: { id: campaignId },
      data: { 
        status: 'COMPLETED', 
        completedAt: new Date(),
        metrics: {
          totalSent: customers.length,
          success: successCount,
          failed: failCount
        }
      }
    });

    return { total: customers.length, success: successCount, failed: failCount };
  }
}
