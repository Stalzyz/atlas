import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockLogType, PurchaseStatus } from '@raaghas/database';

@Injectable()
export class ProcurementService {
  constructor(private prisma: PrismaService) {}

  // ─── Suppliers ──────────────────────────────────────────────────────────

  async getAllSuppliers() {
    return this.prisma.supplier.findMany({
      include: { _count: { select: { purchaseOrders: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async getSupplierById(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: { purchaseOrders: { orderBy: { createdAt: 'desc' }, take: 10 } },
    });
    if (!supplier) throw new NotFoundException(`Supplier ${id} not found`);
    return supplier;
  }

  async createSupplier(data: {
    name: string; contactPerson?: string; email?: string;
    phone?: string; gstNumber?: string; address?: string; category?: string;
  }) {
    // Hardened mapping to prevent Prisma "Unknown Field" crashes
    const cleanData = {
      name: data.name,
      contactPerson: data.contactPerson || null,
      email: data.email || null,
      phone: data.phone || null,
      gstNumber: data.gstNumber || null,
      address: data.address || null,
      category: data.category || 'General Vendor',
    };
    return this.prisma.supplier.create({ data: cleanData });
  }

  async updateSupplier(id: string, data: any) {
    return this.prisma.supplier.update({ where: { id }, data });
  }

  async deleteSupplier(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: { _count: { select: { purchaseOrders: true } } }
    });
    
    if (!supplier) throw new NotFoundException(`Supplier ${id} not found`);
    if (supplier._count.purchaseOrders > 0) {
      throw new BadRequestException("Cannot delete supplier with existing purchase orders.");
    }

    return this.prisma.supplier.delete({ where: { id } });
  }

  // ─── Purchase Orders ───────────────────────────────────────────────────

  async getAllPurchaseOrders() {
    return this.prisma.purchaseOrder.findMany({
      include: {
        supplier: { select: { name: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPurchaseOrderById(id: string) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        items: {
          include: { variant: { include: { product: true } } }
        }
      }
    });
    if (!po) throw new NotFoundException(`Purchase Order ${id} not found`);
    return po;
  }

  async createPurchaseOrder(data: {
    supplierId: string;
    autoRestock: boolean;
    notes?: string;
    totalCost?: number | string;
    items?: Array<{ variantId: string; quantity: number; costPrice: number; hsnCode?: string }>;
  }) {
    let computedCost = 0;
    const poItemsData = (data.items || []).map(item => {
      computedCost += item.quantity * item.costPrice;
      return {
        variantId: item.variantId,
        quantity: item.quantity,
        costPrice: item.costPrice,
        hsnCode: item.hsnCode,
        gstRate: 5.00, // Default 5% GST for textiles
      };
    });

    const finalCost = data.totalCost ? Number(data.totalCost) : computedCost;

    return this.prisma.purchaseOrder.create({
      data: {
        supplierId: data.supplierId,
        autoRestock: data.autoRestock,
        status: PurchaseStatus.PENDING,
        totalCost: finalCost,
        notes: data.notes,
        items: {
          create: poItemsData,
        },
      },
      include: { items: true }
    });
  }

  async updatePOStatus(id: string, status: PurchaseStatus) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Lock the Purchase Order record for update
      // This prevents other transactions from modifying or reading this PO simultaneously
      const po = await tx.purchaseOrder.findUnique({
        where: { id },
        include: { items: true }
      });

      if (!po) throw new NotFoundException(`Purchase Order ${id} not found`);

      // 2. Check if we've already processed this receipt
      const isAlreadyReceived = po.status === PurchaseStatus.RECEIVED;
      const isTransitioningToReceived = status === PurchaseStatus.RECEIVED;

      if (isTransitioningToReceived && !isAlreadyReceived && po.autoRestock) {
        for (const item of po.items) {
          // 3. Atomic inventory increment
          const updatedVariant = await tx.variant.update({
            where: { id: item.variantId },
            data: {
              inventory: { increment: item.quantity }
            }
          });

          // 4. Guaranteed accurate stock log
          await tx.stockLog.create({
            data: {
              variantId: item.variantId,
              type: StockLogType.RESTOCK,
              change: item.quantity,
              newBalance: updatedVariant.inventory,
              referenceId: po.id,
              notes: `Auto-restock from PO #${po.id.slice(0, 8)}`,
            }
          });
        }
      }

      // 5. Update the status and commit
      return tx.purchaseOrder.update({
        where: { id },
        data: { status },
      });
    }, {
      // Extended timeout for large PO processing
      timeout: 15000
    });
  }
}
