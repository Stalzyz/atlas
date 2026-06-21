import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('analytics')
@UseGuards(AuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('executive-overview')
  async getExecutiveOverview(@Query('from') from?: string) {
    return this.analyticsService.getExecutiveOverview(from);
  }

  @Get('tax-reports')
  async getTaxReports(@Query('from') from?: string, @Query('to') to?: string) {
    return this.analyticsService.getTaxReports(from, to);
  }
}
