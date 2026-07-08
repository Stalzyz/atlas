import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@atlas/database';

@Controller('notifications')
@UseGuards(AuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('templates')
  @Roles('SUPER_ADMIN', 'ADMIN')
  async getTemplates() {
    return this.notificationsService.getTemplates();
  }

  @Get('templates/:id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  async getTemplateById(@Param('id') id: string) {
    return this.notificationsService.getTemplateById(id);
  }

  @Put('templates/:id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  async updateTemplate(
    @Param('id') id: string,
    @Body() body: { subject?: string; body?: string; isActive?: boolean; name?: string }
  ) {
    return this.notificationsService.updateTemplate(id, body);
  }

  @Post('templates')
  @Roles('SUPER_ADMIN', 'ADMIN')
  async createTemplate(
    @Body() body: { name: string; type: string; subject: string; body: string; isActive?: boolean }
  ) {
    return this.notificationsService.createTemplate(body);
  }

  @Post('seed')
  @Roles('SUPER_ADMIN', 'ADMIN')
  async seedTemplates() {
    return this.notificationsService.seedTemplates();
  }
}
