import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthOtpService {
  private readonly logger = new Logger(AuthOtpService.name);
  private readonly OTP_EXPIRY_MINUTES = 10;

  constructor(private prisma: PrismaService) {}

  async generateOtp(email: string): Promise<string> {
    // Generate a 4-digit numeric code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRY_MINUTES);

    // Save to database (using the new Otp model)
    await (this.prisma as any).otp.create({
      data: {
        email,
        code,
        expiresAt,
      },
    });

    this.logger.log(`Generated OTP for ${email}: ${code} (expires at ${expiresAt.toISOString()})`);
    return code;
  }

  async verifyOtp(email: string, code: string): Promise<boolean> {
    const otp = await (this.prisma as any).otp.findFirst({
      where: {
        email,
        code,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!otp) {
      this.logger.warn(`Failed OTP verification for ${email}`);
      return false;
    }

    // Delete the code after successful verification (one-time use)
    await (this.prisma as any).otp.delete({
      where: { id: otp.id },
    });

    this.logger.log(`Successful OTP verification for ${email}`);
    return true;
  }

  async cleanupExpiredOtps() {
    const deleted = await (this.prisma as any).otp.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    if (deleted.count > 0) {
      this.logger.log(`Cleaned up ${deleted.count} expired OTPs`);
    }
  }
}
