import {
  Controller, Get, Post, Query, Res, Headers, UnauthorizedException,
  BadRequestException, NotFoundException, UseGuards,
} from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { BackupService } from './backup.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';

const BACKUP_API_SECRET = process.env.BACKUP_API_SECRET || '';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get('logs')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  getLogs(@Query('limit') limit?: string) {
    const n = limit ? parseInt(limit, 10) : 200;
    return this.backupService.getLogs(n);
  }

  @Get('status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  getStatus() {
    return this.backupService.getStatus();
  }

  @Get('download')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  downloadLatest(@Query('type') type: string, @Res() res: Response) {
    if (type !== 'db' && type !== 'files') {
      throw new BadRequestException('type must be "db" or "files"');
    }
    const filePath = this.backupService.getLatestBackupPath(type as 'db' | 'files');
    if (!filePath || !fs.existsSync(filePath)) {
      throw new NotFoundException('No backup file found');
    }
    const filename = path.basename(filePath);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    fs.createReadStream(filePath).pipe(res);
  }

  // Called by shell scripts — protected by a shared secret (not session auth)
  @Post('notify')
  @Public()
  async notify(
    @Headers('x-backup-secret') secret: string,
    @Body() body: {
      type: 'db' | 'files';
      status: 'success' | 'failed';
      reason?: string;
      file?: string;
      size?: string;
    },
  ) {
    if (BACKUP_API_SECRET && secret !== BACKUP_API_SECRET) {
      throw new UnauthorizedException('Invalid backup secret');
    }
    await this.backupService.handleNotification(body);
    return { ok: true };
  }
}
