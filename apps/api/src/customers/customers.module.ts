import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CustomersController],
  providers: [],
})
export class CustomersModule {}
