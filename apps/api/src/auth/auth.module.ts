import { Module, Global } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthOtpService } from './auth-otp.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuard } from './roles.guard';

@Global()
@Module({
  imports: [
    MailModule,
    ConfigModule,
    JwtModule.registerAsync({
      global: true, // Make JwtService globally available
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthGuard, RolesGuard, AuthService, AuthOtpService],
  exports: [AuthGuard, RolesGuard, AuthService, AuthOtpService, JwtModule],
})
export class AuthModule {}
