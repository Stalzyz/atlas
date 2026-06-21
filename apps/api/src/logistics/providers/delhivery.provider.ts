import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateShipmentDto, ShipmentResponse, ShippingProvider, TrackingResponse } from './shipping-provider.interface';

@Injectable()
export class DelhiveryProvider implements ShippingProvider {
  private readonly logger = new Logger(DelhiveryProvider.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {}

  private async getApiUrl() {
    const settings = await this.prisma.storeSettings.findUnique({ where: { id: 'global' } }) as any;
    const env = settings?.delhiveryEnv || this.configService.get<string>('DELHIVERY_ENV');
    const isProd = env === 'production';
    return isProd ? 'https://track.delhivery.com' : 'https://staging-express.delhivery.com';
  }

  private async getHeaders() {
    const settings = await this.prisma.storeSettings.findUnique({ where: { id: 'global' } }) as any;
    const token = settings?.delhiveryToken || this.configService.get<string>('DELHIVERY_TOKEN');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    };
  }

  async createOrder(data: CreateShipmentDto): Promise<ShipmentResponse> {
    const settings = await this.prisma.storeSettings.findUnique({ where: { id: 'global' } }) as any;
    const payload = {
      shipments: [
        {
          add: data.address.address,
          address_type: 'home',
          phone: data.customerPhone,
          payment_mode: data.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
          name: data.customerName,
          pin: data.address.pincode,
          order: data.orderId,
          total_amount: data.subTotal,
          cod_amount: data.paymentMethod === 'COD' ? data.subTotal : 0,
          weight: data.totalWeight,
        },
      ],
      pickup_location: {
        name: settings?.delhiveryPickupLocation || this.configService.get<string>('DELHIVERY_PICKUP_LOCATION') || 'Primary',
      },
    };

    const response = await fetch(`${await this.getApiUrl()}/api/cmu/create.json`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      this.logger.error('Delhivery order creation failed', error);
      throw new Error(`Delhivery error: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(`Delhivery error: ${JSON.stringify(result.packages[0].errors)}`);
    }

    const pkg = result.packages[0];
    return {
      shipmentId: pkg.waybill,
      trackingId: pkg.waybill,
      courierName: 'Delhivery',
    };
  }

  async trackShipment(trackingId: string): Promise<TrackingResponse> {
    const response = await fetch(`${await this.getApiUrl()}/api/v1/packages/json/?waybill=${trackingId}`, {
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Delhivery tracking failed');
    }

    const data = await response.json();
    const pkg = data.ShipmentData[0].Shipment;

    return {
      status: pkg.Status.Status || 'UNKNOWN',
      statusDetail: pkg.Status.Instructions,
      location: pkg.Status.ScannedLocation,
      timestamp: pkg.Status.StatusDateTime ? new Date(pkg.Status.StatusDateTime) : undefined,
      history: pkg.Scans,
    };
  }

  async cancelShipment(shipmentId: string): Promise<boolean> {
    const payload = {
      waybill: shipmentId,
      cancellation: true,
    };

    const response = await fetch(`${await this.getApiUrl()}/api/p/edit/`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(payload),
    });

    return response.ok;
  }
}
