import { Module, Global } from '@nestjs/common';
import { MailService } from './mail.service';
import { PrismaService } from '../prisma/prisma.service';

@Global()
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
