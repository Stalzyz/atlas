import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@atlas/database';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'production'
          ? ['error', 'warn']
          : ['query', 'error', 'warn'],
    });
  }

  async onModuleInit() {
    this.logger.log('📡 Connecting to PostgreSQL (Native)...');
    try {
      // Add a 30-second timeout to the initial connection to prevent silent hangs
      await Promise.race([
        this.$connect(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('PostgreSQL connection timeout (30s)')), 30000)
        )
      ]);
      this.logger.log(`✅ PostgreSQL connected (${process.env.NODE_ENV})`);
    } catch (err: any) {
      this.logger.error('❌ Failed to connect to PostgreSQL', err.message);
      // In production, we want to fail fast so PM2 can restart or we can see the error
      throw err;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();

    this.logger.log('PostgreSQL connection closed.');
  }
}

