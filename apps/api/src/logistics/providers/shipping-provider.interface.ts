export interface CreateShipmentDto {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: Array<{
    name: string;
    sku: string;
    quantity: number;
    price: number;
    weight: number;
  }>;
  totalWeight: number;
  paymentMethod: 'COD' | 'Prepaid';
  subTotal: number;
}

export interface ShipmentResponse {
  trackingId: string;
  shipmentId: string;
  courierName?: string;
  labelUrl?: string;
  manifestUrl?: string;
}

export interface TrackingResponse {
  status: string;
  statusDetail?: string;
  location?: string;
  timestamp?: Date;
  history?: any[];
}

export interface ShippingProvider {
  createOrder(data: CreateShipmentDto): Promise<ShipmentResponse>;
  trackShipment(trackingId: string): Promise<TrackingResponse>;
  cancelShipment(shipmentId: string): Promise<boolean>;
}
