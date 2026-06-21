import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateShipmentDto, ShipmentResponse, ShippingProvider, TrackingResponse } from './shipping-provider.interface';

@Injectable()
export class ShiprocketProvider implements ShippingProvider {
  private readonly logger = new Logger(ShiprocketProvider.name);
  private token: string | null = null;
  private tokenExpiry: number | null = null;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {}

  private async authenticate() {
    const now = Date.now();
    if (this.token && this.tokenExpiry && now < this.tokenExpiry) {
      return this.token;
    }

    const settings = await this.prisma.storeSettings.findUnique({ where: { id: 'global' } }) as any;
    const email = settings?.shiprocketEmail || this.configService.get<string>('SHIPROCKET_EMAIL');
    const password = settings?.shiprocketPassword || this.configService.get<string>('SHIPROCKET_PASSWORD');

    if (!email || !password) {
      throw new Error('Shiprocket credentials missing');
    }

    const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      this.logger.error('Shiprocket login failed', error);
      throw new Error('Shiprocket authentication failed');
    }

    const data = await response.json();
    this.token = data.token;
    this.tokenExpiry = now + 10 * 24 * 60 * 60 * 1000; // Token valid for 10 days
    return this.token;
  }

  async createOrder(data: CreateShipmentDto): Promise<ShipmentResponse> {
    const token = await this.authenticate();
    const settings = await this.prisma.storeSettings.findUnique({ where: { id: 'global' } }) as any;

    const payload = {
      order_id: data.orderId,
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: settings?.shiprocketPickupLocation || this.configService.get<string>('SHIPROCKET_PICKUP_LOCATION') || 'Primary',
      billing_customer_name: data.customerName,
      billing_last_name: '',
      billing_address: data.address.address,
      billing_city: data.address.city,
      billing_pincode: data.address.pincode,
      billing_state: data.address.state,
      billing_country: data.address.country,
      billing_email: data.customerEmail,
      billing_phone: data.customerPhone,
      shipping_is_billing: true,
      order_items: data.items.map(item => ({
        name: item.name,
        sku: item.sku,
        units: item.quantity,
        selling_price: item.price,
      })),
      payment_method: data.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
      sub_total: data.subTotal,
      length: 10, // Default dimensions
      breadth: 10,
      height: 10,
      weight: data.totalWeight,
    };

    const response = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      this.logger.error('Shiprocket order creation failed', error);
      throw new Error(`Shiprocket error: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    return {
      shipmentId: result.shipment_id.toString(),
      trackingId: result.awb_code || '',
      courierName: result.courier_name || 'Shiprocket',
    };
  }

  async trackShipment(trackingId: string): Promise<TrackingResponse> {
    const token = await this.authenticate();

    const response = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${trackingId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Shiprocket tracking failed');
    }

    const data = await response.json();
    const tracking = data.tracking_data;

    return {
      status: tracking.shipment_status || 'UNKNOWN',
      statusDetail: tracking.shipment_status_detail,
      location: tracking.last_location,
      timestamp: tracking.scanned_date ? new Date(tracking.scanned_date) : undefined,
      history: tracking.shipment_track_activities,
    };
  }

  async cancelShipment(shipmentId: string): Promise<boolean> {
    const token = await this.authenticate();

    const response = await fetch('https://apiv2.shiprocket.in/v1/external/orders/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ ids: [shipmentId] }),
    });

    return response.ok;
  }
}
