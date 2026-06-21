import { Controller, Get, Post, Patch, Delete, Body, Param, Query, BadRequestException, Header } from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { LeadStatus } from '@raaghas/database';
import { Public } from '../auth/public.decorator';

@Controller('marketing')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  // ─── LEAD TRACKING (Storefront → Backend) ─────────────────────────────────

  @Public()
  @Post('discounts/track-lead')
  async trackLead(@Body() body: {
    phone: string;
    email?: string;
    name?: string;
    cartTotal: number;
    items?: any[];
  }) {
    if (!body.phone) throw new BadRequestException('Phone is required to track lead.');
    return this.marketingService.trackOrUpdateLead(body);
  }

  // ─── DISCOUNT VALIDATION ──────────────────────────────────────────────────

  @Public()
  @Post('discounts/validate')
  async validateDiscount(@Body() body: { code: string; cartTotal: number }) {
    if (!body.code) throw new BadRequestException('Discount code is required.');
    try {
      return await this.marketingService.validateDiscount(body.code, body.cartTotal);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Get('discounts')
  async getAllDiscounts() {
    return this.marketingService.getAllDiscounts();
  }

  @Post('discounts')
  async createDiscount(@Body() body: any) {
    if (!body.code) throw new BadRequestException('Code is required.');
    if (!body.type) throw new BadRequestException('Type is required.');
    if (body.value === undefined) throw new BadRequestException('Value is required.');
    return this.marketingService.createDiscount(body);
  }

  @Delete('discounts/:id')
  async deleteDiscount(@Param('id') id: string) {
    return this.marketingService.deleteDiscount(id);
  }

  @Patch('discounts/:id/toggle')
  async toggleDiscountActive(@Param('id') id: string) {
    return this.marketingService.toggleDiscountActive(id);
  }

  // ─── ADMIN: LEAD DASHBOARD ────────────────────────────────────────────────

  @Get('leads')
  async getLeads(@Query('status') status?: string) {
    return this.marketingService.getLeads(status ? { status: status as LeadStatus } : undefined);
  }


  @Get('leads/stats')
  async getLeadStats() {
    return this.marketingService.getLeadStats();
  }

  @Post('leads/:id/nudge')
  async sendManualNudge(
    @Param('id') id: string,
    @Body() body: { template: 'NUDGE_1' | 'NUDGE_2' },
  ) {
    if (!body.template) throw new BadRequestException('Template is required (NUDGE_1 or NUDGE_2).');
    return this.marketingService.sendManualNudge(id, body.template);
  }

  @Post('leads/:id/mark-converted')
  async markConverted(@Param('id') id: string) {
    return this.marketingService.markLeadConverted(id);
  }

  // ─── OFFER RULES (Automated Offer Engine) ─────────────────────────────────

  @Get('offer-rules')
  async getOfferRules() {
    return this.marketingService.getOfferRules();
  }

  @Post('offer-rules')
  async createOfferRule(@Body() body: any) {
    if (!body.name) throw new BadRequestException('Rule name is required.');
    if (!body.conditions) throw new BadRequestException('At least one condition is required.');
    if (!body.actions) throw new BadRequestException('At least one action is required.');
    return this.marketingService.createOfferRule(body);
  }

  @Post('offer-rules/:id')
  async updateOfferRule(@Param('id') id: string, @Body() body: any) {
    return this.marketingService.updateOfferRule(id, body);
  }

  @Post('offer-rules/:id/delete')
  async deleteOfferRule(@Param('id') id: string) {
    return this.marketingService.deleteOfferRule(id);
  }

  // ─── META / FACEBOOK COMMERCE FEED ────────────────────────────────────────

  @Public()
  @Get('facebook-feed.xml')
  @Header('Content-Type', 'application/xml')
  async getFacebookFeed() {
    return this.marketingService.generateFacebookXmlFeed();
  }
}
