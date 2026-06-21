import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';

// Exponential backoff schedule (seconds after each failure):
// Attempt 1 fail → retry in  30s
// Attempt 2 fail → retry in   2m
// Attempt 3 fail → retry in  10m
// Attempt 4 fail → retry in  30m
// Attempt 5 fail → retry in   2h  → then DEAD
const BACKOFF_SECONDS = [30, 120, 600, 1800, 7200];
const MAX_ATTEMPTS = 5;

export type WebhookProcessor = (event: any) => Promise<{ orderId?: string }>;

@Injectable()
export class WebhookQueueService {
  private readonly logger = new Logger(WebhookQueueService.name);

  // Handlers registered by gateway → eventType
  private readonly handlers = new Map<string, WebhookProcessor>();

  constructor(private readonly prisma: PrismaService) {}

  // ─── REGISTER a handler (called during module init) ───────────────────────

  register(gateway: string, eventType: string, handler: WebhookProcessor) {
    this.handlers.set(`${gateway}:${eventType}`, handler);
  }

  // ─── RECEIVE: Store incoming webhook immediately & return 200 ─────────────
  // The gateway should always receive a 200 within 3 seconds.
  // All actual processing is async via the cron job.

  async receive(data: {
    gateway: string;
    eventType: string;
    rawPayload: any;
    signature?: string;
  }): Promise<{ accepted: boolean; eventId: string }> {
    const event = await (this.prisma as any).webhookEvent.create({
      data: {
        gateway: data.gateway,
        eventType: data.eventType,
        rawPayload: data.rawPayload,
        signature: data.signature,
        status: 'RECEIVED',
        nextRetryAt: new Date(), // Process immediately on next cron tick
      },
    });

    this.logger.log(`📬 Webhook received: [${data.gateway}] ${data.eventType} → ID ${event.id}`);
    return { accepted: true, eventId: event.id };
  }

  // ─── CRON: Process pending webhooks every 60 seconds ─────────────────────

  @Cron('*/60 * * * * *') // Every 60 seconds
  async processPendingWebhooks() {
    const now = new Date();

    // Find RECEIVED or FAILED events that are due for processing
    const events = await (this.prisma as any).webhookEvent.findMany({
      where: {
        status: { in: ['RECEIVED', 'FAILED'] },
        nextRetryAt: { lte: now },
      },
      orderBy: { nextRetryAt: 'asc' },
      take: 50, // Process at most 50 per cycle
    });

    if (events.length === 0) return;
    this.logger.log(`⚙️  Webhook Cron: Processing ${events.length} pending event(s)...`);

    for (const event of events) {
      await this._processEvent(event);
    }
  }

  private async _processEvent(event: any) {
    // 1. Claim the event atomically — prevent duplicate concurrent processing
    const claimed = await (this.prisma as any).webhookEvent.updateMany({
      where: { id: event.id, status: { in: ['RECEIVED', 'FAILED'] } },
      data: { status: 'PROCESSING' },
    });

    if (claimed.count === 0) {
      // Another process already claimed it (race condition guard)
      this.logger.debug(`Event ${event.id} already claimed by another worker. Skipping.`);
      return;
    }

    const handlerKey = `${event.gateway}:${event.eventType}`;
    const handler = this.handlers.get(handlerKey);

    if (!handler) {
      // No handler registered — move to DLQ immediately, not worth retrying
      await this._moveToDLQ(event.id, `No handler registered for ${handlerKey}`);
      return;
    }

    const newAttempts = event.attempts + 1;

    try {
      const result = await handler(event.rawPayload);

      // SUCCESS: Mark as processed
      await (this.prisma as any).webhookEvent.update({
        where: { id: event.id },
        data: {
          status: 'SUCCESS',
          attempts: newAttempts,
          orderId: result?.orderId,
          lastError: null,
          processedAt: new Date(),
        },
      });

      this.logger.log(`✅ Webhook [${event.id}] processed successfully (attempt ${newAttempts})`);

    } catch (err: any) {
      const errorMessage = err?.message || String(err);
      this.logger.warn(`⚠️  Webhook [${event.id}] failed on attempt ${newAttempts}: ${errorMessage}`);

      if (newAttempts >= MAX_ATTEMPTS) {
        // Max retries exhausted → Dead Letter Queue
        await this._moveToDLQ(event.id, `Max retries (${MAX_ATTEMPTS}) exceeded. Last error: ${errorMessage}`, newAttempts, errorMessage);
      } else {
        // Schedule next retry with exponential backoff
        const backoffSec = BACKOFF_SECONDS[newAttempts - 1] ?? 7200;
        const nextRetryAt = new Date(Date.now() + backoffSec * 1000);

        await (this.prisma as any).webhookEvent.update({
          where: { id: event.id },
          data: {
            status: 'FAILED',
            attempts: newAttempts,
            lastError: errorMessage,
            nextRetryAt,
          },
        });

        this.logger.log(`🔁 Webhook [${event.id}] scheduled for retry at ${nextRetryAt.toISOString()} (backoff: ${backoffSec}s)`);
      }
    }
  }

  private async _moveToDLQ(eventId: string, reason: string, attempts?: number, lastError?: string) {
    await (this.prisma as any).webhookEvent.update({
      where: { id: eventId },
      data: {
        status: 'DEAD',
        deadReason: reason,
        deadAt: new Date(),
        ...(attempts !== undefined && { attempts }),
        ...(lastError && { lastError }),
      },
    });
    this.logger.error(`💀 Webhook [${eventId}] moved to DEAD LETTER QUEUE: ${reason}`);
  }

  // ─── ADMIN: View Dead Letter Queue ────────────────────────────────────────

  async getDeadLetterQueue(take = 50) {
    return (this.prisma as any).webhookEvent.findMany({
      where: { status: 'DEAD' },
      orderBy: { deadAt: 'desc' },
      take,
    });
  }

  // ─── ADMIN: Manually replay a dead event ─────────────────────────────────

  async replayEvent(eventId: string): Promise<{ success: boolean; message: string }> {
    const event = await (this.prisma as any).webhookEvent.findUnique({ where: { id: eventId } });
    if (!event) return { success: false, message: 'Event not found.' };
    if (event.status === 'SUCCESS') return { success: false, message: 'Event already succeeded.' };

    // Reset to RECEIVED so the next cron picks it up
    await (this.prisma as any).webhookEvent.update({
      where: { id: eventId },
      data: {
        status: 'RECEIVED',
        attempts: 0,
        lastError: null,
        deadReason: null,
        deadAt: null,
        nextRetryAt: new Date(), // Immediately eligible
      },
    });

    this.logger.log(`♻️  Webhook [${eventId}] manually re-queued for replay.`);
    return { success: true, message: `Event ${eventId} re-queued. Will process in next cron cycle.` };
  }

  // ─── ADMIN: Queue Stats ───────────────────────────────────────────────────

  async getQueueStats() {
    const [received, processing, failed, dead, success] = await Promise.all([
      (this.prisma as any).webhookEvent.count({ where: { status: 'RECEIVED' } }),
      (this.prisma as any).webhookEvent.count({ where: { status: 'PROCESSING' } }),
      (this.prisma as any).webhookEvent.count({ where: { status: 'FAILED' } }),
      (this.prisma as any).webhookEvent.count({ where: { status: 'DEAD' } }),
      (this.prisma as any).webhookEvent.count({ where: { status: 'SUCCESS' } }),
    ]);

    return {
      queue: { received, processing, failed },
      deadLetterQueue: dead,
      processed: success,
      healthScore: dead === 0 && failed === 0 ? '🟢 Healthy' : dead > 5 ? '🔴 Critical' : '🟡 Degraded',
    };
  }
}
