import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { MailService } from '../mail/mail.service';
import { WholesalePdfService } from './wholesale-pdf.service';
import { LedgerService } from '../analytics/ledger.service';

@Injectable()
export class WholesaleService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => InventoryService))
    private inventoryService: InventoryService,
    private mailService: MailService,
    private pdfService: WholesalePdfService,
    private ledgerService: LedgerService,
  ) {}

  // ─── Retailers ────────────────────────────────────────────────────────────

  async getAllRetailers(filters?: { status?: string; tier?: string; search?: string }) {
    return (this.prisma as any).retailer.findMany({
      where: {
        ...(filters?.status && { status: filters.status as any }),
        ...(filters?.tier   && { tier:   filters.tier   as any }),
        ...(filters?.search && {
          OR: [
            { businessName: { contains: filters.search, mode: 'insensitive' } },
            { contactName:  { contains: filters.search, mode: 'insensitive' } },
            { email:        { contains: filters.search, mode: 'insensitive' } },
            { city:         { contains: filters.search, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        priceList: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRetailerById(id: string) {
    const retailer = await (this.prisma as any).retailer.findUnique({
      where: { id },
      include: {
        priceList: true,
        orders: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    if (!retailer) throw new NotFoundException(`Retailer ${id} not found`);
    return retailer;
  }

  async getRetailerByUserId(clerkId: string) {
    const retailer = await this.prisma.retailer.findUnique({
      where: { clerkId },
      include: {
        priceList: true,
        orders: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });
    return retailer;
  }

  async createRetailer(data: {
    businessName: string; contactName: string; email: string; phone: string;
    clerkId?: string; gstNumber?: string; address?: string; city?: string; 
    state?: string; tier?: string; creditLimit?: number; 
    creditTermDays?: number; notes?: string; priceListId?: string;
  }) {
    const existing = await (this.prisma as any).retailer.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictException('A retailer with this email already exists');

    return (this.prisma as any).retailer.create({
      data: {
        ...data,
        tier: (data.tier as any) || 'SILVER',
        status: 'PENDING',
      },
    });
  }

  async updateRetailer(id: string, data: Partial<{
    businessName: string; contactName: string; phone: string; gstNumber: string;
    address: string; city: string; state: string; tier: string; status: string;
    creditLimit: number; creditTermDays: number; notes: string; priceListId: string;
  }>) {
    await this.getRetailerById(id); // Throws if not found
    return (this.prisma as any).retailer.update({ where: { id }, data: data as any });
  }

  async approveRetailer(id: string) {
    return (this.prisma as any).retailer.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
  }

  async suspendRetailer(id: string) {
    return (this.prisma as any).retailer.update({
      where: { id },
      data: { status: 'SUSPENDED' },
    });
  }

  // PDF generation logic has been moved to WholesalePdfService


  // ─── Price Lists ──────────────────────────────────────────────────────────

  async getAllPriceLists() {
    return (this.prisma as any).priceList.findMany({
      include: { _count: { select: { retailers: true } } },
      orderBy: { discountPercent: 'desc' },
    });
  }

  async createPriceList(data: {
    name: string; discountPercent: number; moqPerSku?: number; moqPerOrder?: number;
  }) {
    return (this.prisma as any).priceList.create({ data: data as any });
  }

  async updatePriceList(id: string, data: Partial<{
    name: string; discountPercent: number; moqPerSku: number; moqPerOrder: number;
  }>) {
    return (this.prisma as any).priceList.update({ where: { id }, data: data as any });
  }

  async deletePriceList(id: string) {
    return (this.prisma as any).priceList.delete({ where: { id } });
  }

  // ─── Orders ───────────────────────────────────────────────────────────────

  async getAllOrders(filters?: { status?: string; retailerId?: string }) {
    return (this.prisma as any).wholesaleOrder.findMany({
      where: {
        ...(filters?.status && { status: filters.status }),
        ...(filters?.retailerId && { retailerId: filters.retailerId }),
      },
      include: {
        retailer: { select: { businessName: true, email: true } },
        _count: { select: { items: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderById(id: string) {
    const order = await (this.prisma as any).wholesaleOrder.findUnique({
      where: { id },
      include: {
        retailer: {
          include: { priceList: true }
        },
        items: {
          include: {
            variant: { include: { product: true } }
          }
        }
      }
    });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  async createDraftOrder(data: {
    retailerId: string;
    notes?: string;
    items: Array<{ productId: string; variantId: string; quantity: number }>;
  }) {
    const retailer = await (this.prisma as any).retailer.findUnique({
      where: { id: data.retailerId },
      include: { priceList: true },
    });
    if (!retailer) throw new NotFoundException('Retailer not found');

    const discountPercent = Number(retailer.priceList?.discountPercent || 0);

    let totalAmount = 0;
    const orderItemsData: any[] = [];

    for (const item of data.items) {
      // SKIP EMPTY ROWS FOR DRAFTS
      if (!item.variantId || !item.productId) continue;

      const variant = await (this.prisma as any).variant.findUnique({ where: { id: item.variantId } });
      if (!variant) continue; 

      const unitMrp = Number(variant.price);
      const unitWholesalePrice = unitMrp * (1 - (discountPercent / 100));
      const quantity = Math.max(1, item.quantity); // ATOMIC GUARD: Minimum 1 qty
      const totalPrice = unitWholesalePrice * quantity;
      
      totalAmount += totalPrice;

      const product = await (this.prisma as any).product.findUnique({ where: { id: item.productId }, select: { hsnCode: true } });
      const hsnCode = product?.hsnCode || 'TEXTILE-00';

      orderItemsData.push({
        productId: item.productId,
        variantId: item.variantId,
        quantity: quantity,
        unitMrp,
        unitWholesalePrice,
        totalPrice,
        hsnCode,
      });
    }

    return (this.prisma as any).wholesaleOrder.create({
      data: {
        retailerId: data.retailerId,
        status: 'DRAFT',
        notes: data.notes,
        totalAmount,
        items: {
          create: orderItemsData,
        },
      },
      include: { items: true }
    });
  }

  async updateOrderStatus(id: string, status: string, advancePaid?: number) {
    return (this.prisma as any).wholesaleOrder.update({
      where: { id },
      data: { 
        status,
        ...(advancePaid !== undefined && { advancePaid })
      }
    });
  }

  // ─── Invoicing ────────────────────────────────────────────────────────────

  async generateGSTInvoice(orderId: string) {
    const order = await this.getOrderById(orderId);

    // ─── RESERVE STOCK ───
    await (this.prisma as any).$transaction(async (tx: any) => {
      const existingReservation = await tx.stockReservation.findFirst({
        where: { proformaId: orderId }
      });

      if (!existingReservation) {
        for (const item of order.items) {
          try {
            await this.inventoryService.reserveStock({
              variantId: item.variantId,
              quantity: item.quantity,
              proformaId: order.id,
              expiresInMinutes: 4320
            }, tx);
          } catch (e: any) {
            console.warn(`Could not reserve stock for variant ${item.variantId}: ${e.message}`);
          }
        }
      }
    });

    let settings = null;
    try {
      settings = await (this.prisma as any).storeSettings.findUnique({ where: { id: 'global' } });
    } catch(e) {} // Fallback if settings module is incomplete

    let subtotal = 0;
    let totalGst = 0;
    const taxBuckets = new Map<number, number>();

    const itemsPayload = order.items.map((item: any) => {
      const taxableValue = Number(item.totalPrice);
      const unitPrice = Number(item.unitWholesalePrice);
      
      // EXPERT FIX: Dynamic GST based on Indian Textile Price Thresholds
      // Price <= 1000 -> 5%, Price > 1000 -> 12%
      const taxRate = unitPrice <= 1000 ? 5 : 12;
      
      const hsnCode = item.hsnCode || item.variant?.product?.hsnCode || 'TEXTILE-00';
      const itemGst = taxableValue * (taxRate / 100);
      
      subtotal += taxableValue;
      totalGst += itemGst;

      taxBuckets.set(taxRate, (taxBuckets.get(taxRate) || 0) + itemGst);

      return {
        description: `${item.variant.product.title} (${item.variant.sku})`,
        hsn: hsnCode,
        taxPercent: taxRate,
        quantity: item.quantity,
        unitPrice: Number(item.unitWholesalePrice),
        taxableValue,
      };
    });

    const grandTotal = subtotal + totalGst;
    
    // Switch between CGST/SGST and IGST based on state overlap
    const businessState = (settings as any)?.businessState?.toLowerCase() || 'tamil nadu';
    const buyerState = order.retailer.state?.toLowerCase() || '';
    const isInterState = buyerState !== businessState; 

    let taxes: any[] = [];
    
    taxBuckets.forEach((amount, rate) => {
      if (amount > 0) {
        if (isInterState) {
          taxes.push({ name: `IGST (${rate}%)`, amount });
        } else {
          taxes.push({ name: `CGST (${rate/2}%)`, amount: amount / 2 });
          taxes.push({ name: `SGST (${rate/2}%)`, amount: amount / 2 });
        }
      }
    });

    const invoicePayload = {
      invoiceNumber: order.formattedOrderNumber || order.orderNumber ? `PRO-${order.orderNumber}` : `PRO-${order.id.slice(0,8).toUpperCase()}`,
      date: new Date().toISOString(),
      seller: {
        name: (settings as any)?.storeName || 'Raaghas',
        email: (settings as any)?.supportEmail || 'wholesale@raaghas.com',
        phone: (settings as any)?.supportPhone || '',
        gst: (settings as any)?.gstNumber || '33AABCU9603R1ZX', 
        address: (settings as any)?.businessAddress || 'Salem, India',
        state: (settings as any)?.businessState || 'Tamil Nadu'
      },
      buyer: {
        name: order.retailer.businessName,
        contact: order.retailer.contactName,
        email: order.retailer.email,
        phone: order.retailer.phone,
        address: `${order.retailer.address || ''}, ${order.retailer.city || ''}, ${order.retailer.state || ''}`,
        gst: order.retailer.gstNumber || 'Unregistered Retailer'
      },
      items: itemsPayload,
      summary: {
        totalMrp: order.items.reduce((acc: number, it: any) => acc + (Number(it.unitMrp) * it.quantity), 0),
        subtotal,
        taxes,
        totalGst,
        grandTotal
      },
      bankDetails: {
        accountName: (settings as any)?.accountName || 'Raaghas Pvt Ltd',
        accountNumber: (settings as any)?.accountNumber || '50200012345678',
        ifscCode: (settings as any)?.ifscCode || 'HDFC0001234',
        bankName: (settings as any)?.bankName || 'HDFC Bank, Chennai Main'
      },
      // Responsiveness helper for PDF generation
      layoutConfig: {
        fontSize: '10px',
        primaryColor: '#701A31',
        spacing: 'tight'
      }
    };

    return invoicePayload;
  }

  async sendInvoiceEmail(orderId: string, data: { subject: string; body: string; signature: string }) {
    const order = await this.getOrderById(orderId);
    
    // Generate the full payload first
    const payload = await this.generateGSTInvoice(orderId);
    
    // Generate the styled PDF buffer
    const pdfBuffer = await this.pdfService.generateStyledWholesalePDF(payload);

    return this.mailService.sendLedgerEmail(
      order.retailer.email,
      data.subject,
      data.body,
      data.signature,
      [{ filename: `${payload.invoiceNumber}.pdf`, content: pdfBuffer }]
    );
  }
  /**
   * Actually marks the order as invoiced and records it in the ledger.
   * This should be called by a POST request.
   */
  async publishGSTInvoice(orderId: string) {
    const order = await this.getOrderById(orderId);
    if (order.isPublished) return this.generateGSTInvoice(orderId);

    // ─── ATOMIC PUBLICATION (expert-analyst-fix) ───
    return await this.prisma.$transaction(async (tx: any) => {
      // 1. Re-verify the order status inside the lock
      const freshOrder = await tx.wholesaleOrder.findUnique({
        where: { id: orderId },
        include: { items: true, retailer: true }
      });

      if (freshOrder.isPublished) return this.generateGSTInvoice(orderId);

      // 2. Perform Stock Reservation INSIDE the transaction
      const existingReservation = await tx.stockReservation.findFirst({
        where: { proformaId: orderId }
      });

      if (!existingReservation) {
        for (const item of freshOrder.items) {
          await this.inventoryService.reserveStock({
            variantId: item.variantId,
            quantity: item.quantity,
            proformaId: freshOrder.id,
            expiresInMinutes: 4320
          }, tx);
        }
      }

      // 3. Generate the calculated data (Purely for ledger/response)
      const invoice: any = await this.generateGSTInvoice(orderId);
      
      // 4. Update the order status
      await tx.wholesaleOrder.update({
        where: { id: orderId },
        data: { isPublished: true, status: 'INVOICED' }
      });

      // 5. Record in Ledger
      const settings = await tx.storeSettings.findUnique({ where: { id: 'global' } });
      const businessState = settings?.businessState?.toLowerCase() || 'tamil nadu';
      const buyerState = freshOrder.retailer.state?.toLowerCase() || '';
      const isInterState = buyerState !== businessState;

      await this.ledgerService.createEntry({
        type: 'SALE',
        amount: invoice.summary.grandTotal,
        taxableValue: invoice.summary.subtotal,
        cgst: isInterState ? 0 : invoice.summary.totalGst / 2,
        sgst: isInterState ? 0 : invoice.summary.totalGst / 2,
        igst: isInterState ? invoice.summary.totalGst : 0,
        totalTax: invoice.summary.totalGst,
        referenceId: orderId,
        partyName: freshOrder.retailer.businessName,
        isDraft: false,
        notes: `Wholesale Invoice for ${freshOrder.retailer.businessName}`
      }, tx);

      // ─── SEND NOTIFICATION EMAIL (Post-Commit Async) ───
      // We don't block the transaction for the email
      this.mailService.sendInvoiceEmail(
        freshOrder.retailer.email,
        freshOrder.retailer.contactName || freshOrder.retailer.businessName,
        invoice.invoiceNumber,
        invoice.summary.grandTotal
      ).catch(e => console.error(`Failed to send automated invoice email: ${e.message}`));

      return { ...invoice, isPublished: true };
    }, {
      timeout: 20000 // Extended timeout for heavy wholesale processing
    });
  }
}
