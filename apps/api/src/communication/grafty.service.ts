import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GraftyService {
  private readonly logger = new Logger(GraftyService.name);

  constructor(private config: ConfigService, private prisma: PrismaService) {}

  /**
   * Send an automated WhatsApp Template Message via Grafty
   * 
   * @param recipientPhone The customer's phone number with country code (e.g., +919876543210)
   * @param recipientName The customer's name
   * @param event The event type (e.g., ORDER_CREATED, ABANDONED_CART)
   * @param templateName The approved WhatsApp template name in Grafty
   * @param variables Array of variables to inject into the template body
   * @param buttonVariables Array of variables to inject into template buttons (optional)
   */
  async sendWhatsAppNudge({
    recipientPhone,
    recipientName,
    event,
    templateName,
    variables,
    buttonVariables = [],
  }: {
    recipientPhone: string;
    recipientName: string;
    event: string;
    templateName: string;
    variables: string[];
    buttonVariables?: string[];
  }) {
    const settings = await (this.prisma as any).storeSettings.findUnique({ where: { id: 'global' } });
    
    // Grafty credentials are saved under the whatsappApi* fields by the Admin panel
    const graftyUrl = settings?.whatsappApiUrl || this.config.get<string>('GRAFTY_API_URL');
    const graftyKey = settings?.whatsappApiKey || this.config.get<string>('GRAFTY_API_KEY');

    if (!graftyUrl || !graftyKey) {
      this.logger.warn(`Skipping WhatsApp Nudge for ${event} - Grafty credentials missing in database/environment.`);
      return { success: false, reason: 'Missing credentials' };
    }

    const payload = {
      recipient: {
        phone: recipientPhone,
        name: recipientName,
      },
      event,
      template: {
        name: templateName,
        language: 'en',
        variables: {
          header: [],
          body: variables,
          buttons: buttonVariables,
        },
      },
    };

    try {
      this.logger.log(`Dispatching WhatsApp nudge [${templateName}] to ${recipientPhone}`);
      
      const response = await fetch(`${graftyUrl}/api/v1/messages/send-template`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${graftyKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Grafty API rejected request: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      this.logger.log(`WhatsApp nudge successfully queued by Grafty: ${JSON.stringify(data)}`);
      return { success: true, data };
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp nudge to Grafty`, error);
      // We don't want to throw and break the main Atlas flow (like checkout) if WhatsApp fails.
      return { success: false, error: error.message };
    }
  }

  // --- Helpers for specific events ---

  async sendOrderConfirmation(phone: string, name: string, orderId: string, amount: number) {
    return this.sendWhatsAppNudge({
      recipientPhone: phone,
      recipientName: name,
      event: 'ORDER_CREATED',
      templateName: 'order_confirmation_v1',
      variables: [
        name,
        orderId,
        `₹${amount.toLocaleString('en-IN')}`
      ],
      buttonVariables: [`track/${orderId}`]
    });
  }

  async sendShippingUpdate(phone: string, name: string, orderId: string, trackingLink: string) {
    return this.sendWhatsAppNudge({
      recipientPhone: phone,
      recipientName: name,
      event: 'ORDER_SHIPPED',
      templateName: 'shipping_update_v1',
      variables: [
        name,
        orderId,
      ],
      buttonVariables: [trackingLink]
    });
  }

  async sendAbandonedCartNudge(phone: string, name: string, cartId: string) {
    return this.sendWhatsAppNudge({
      recipientPhone: phone,
      recipientName: name,
      event: 'ABANDONED_CART',
      templateName: 'abandan_cart_test',
      variables: [
        name,
      ],
      buttonVariables: [`cart/${cartId}`] // Adjust based on your actual route structure
    });
  }
}
