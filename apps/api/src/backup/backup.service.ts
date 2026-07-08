import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import * as fs from 'fs';
import * as path from 'path';

const BACKUP_LOG = process.env.BACKUP_LOG_FILE || '/backups/logs/backup.log';
const DB_BACKUP_DIR = process.env.DB_BACKUP_DIR || '/backups/db';
const FILES_BACKUP_DIR = process.env.FILES_BACKUP_DIR || '/backups/files';

export interface BackupLogEntry {
  timestamp: string;
  script: string;
  level: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING';
  message: string;
  raw: string;
}

export interface BackupStatus {
  db: { lastSuccess: string | null; lastFile: string | null; count: number };
  files: { lastSuccess: string | null; lastFile: string | null; count: number };
}

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);

  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  getLogs(limit = 200): BackupLogEntry[] {
    if (!fs.existsSync(BACKUP_LOG)) return [];

    const raw = fs.readFileSync(BACKUP_LOG, 'utf-8');
    const lines = raw.trim().split('\n').filter(Boolean).reverse().slice(0, limit);

    return lines.map((line): BackupLogEntry => {
      // Format: [2024-01-01 00:00:00] [backup-db] MESSAGE
      const match = line.match(/^\[(.+?)\] \[(.+?)\] (.+)$/);
      if (!match) return { timestamp: '', script: 'unknown', level: 'INFO', message: line, raw: line };

      const [, timestamp, script, message] = match;
      let level: BackupLogEntry['level'] = 'INFO';
      if (message.startsWith('SUCCESS')) level = 'SUCCESS';
      else if (message.startsWith('ERROR')) level = 'ERROR';
      else if (message.startsWith('WARNING')) level = 'WARNING';

      return { timestamp, script, level, message, raw: line };
    });
  }

  getStatus(): BackupStatus {
    const dbFiles = this.listBackupFiles(DB_BACKUP_DIR, '.sql.gz');
    const fileFiles = this.listBackupFiles(FILES_BACKUP_DIR, '.tar.gz');

    const lastDbSuccess = dbFiles[0] ?? null;
    const lastFileSuccess = fileFiles[0] ?? null;

    return {
      db: {
        lastSuccess: lastDbSuccess ? this.filenameToTimestamp(lastDbSuccess) : null,
        lastFile: lastDbSuccess,
        count: dbFiles.length,
      },
      files: {
        lastSuccess: lastFileSuccess ? this.filenameToTimestamp(lastFileSuccess) : null,
        lastFile: lastFileSuccess,
        count: fileFiles.length,
      },
    };
  }

  getLatestBackupPath(type: 'db' | 'files'): string | null {
    const dir = type === 'db' ? DB_BACKUP_DIR : FILES_BACKUP_DIR;
    const ext = type === 'db' ? '.sql.gz' : '.tar.gz';
    const files = this.listBackupFiles(dir, ext);
    if (!files.length) return null;
    return path.join(dir, files[0]);
  }

  async handleNotification(payload: {
    type: 'db' | 'files';
    status: 'success' | 'failed';
    reason?: string;
    file?: string;
    size?: string;
  }) {
    this.logger.log(`Backup notification: type=${payload.type} status=${payload.status}`);

    if (payload.status === 'failed') {
      await this.sendFailureAlert(payload.type, payload.reason ?? 'Unknown error');
    }
  }

  private listBackupFiles(dir: string, ext: string): string[] {
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(ext))
      .sort()
      .reverse();
  }

  private filenameToTimestamp(filename: string): string {
    // filename format: YYYY-MM-DD_HH-MM-SS.sql.gz
    const match = filename.match(/^(\d{4}-\d{2}-\d{2})_(\d{2})-(\d{2})-(\d{2})/);
    if (!match) return filename;
    const [, date, h, m, s] = match;
    return `${date} ${h}:${m}:${s}`;
  }

  private async sendFailureAlert(type: string, reason: string) {
    try {
      const settings = await (this.prisma as any).storeSettings.findUnique({ where: { id: 'global' } });
      const adminEmail = settings?.supportEmail || process.env.ADMIN_EMAIL || 'admin@atlas.in';

      await this.mail.sendCustomEmail(
        adminEmail,
        `[ALERT] Atlas ${type.toUpperCase()} Backup Failed`,
        `
          <div style="text-align:center;">
            <h2 style="color:#c0392b;">Backup Failure Alert</h2>
            <p>The <strong>${type === 'db' ? 'database' : 'file'} backup</strong> job failed at <strong>${new Date().toISOString()}</strong>.</p>
            <div style="background:#fff5f5;border-left:4px solid #c0392b;padding:16px;margin:24px 0;text-align:left;">
              <strong>Reason:</strong><br/>
              <code>${reason}</code>
            </div>
            <p>Please check <code>/backups/logs/backup.log</code> on the server and restore the backup job as soon as possible.</p>
          </div>
        `,
      );
    } catch (err) {
      this.logger.error(`Failed to send backup failure alert: ${err.message}`);
    }
  }
}
