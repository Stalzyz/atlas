import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WholesalePdfService } from '../wholesale/wholesale-pdf.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class InvoicesService {
  constructor(
    private prisma: PrismaService,
    private pdfService: WholesalePdfService,
    private mailService: MailService
  ) {}

  async sendInvoiceEmail(id: string, customSubject?: string, customBody?: string, customSignature?: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });
    if (!invoice) throw new NotFoundException('Invoice not found');

    const pdfBuffer = await this.pdfService.generateInvoicePDF(invoice);
    
    if (customBody && customSignature) {
      return this.mailService.sendLedgerEmail(
        invoice.customerEmail,
        customSubject || `Tax Invoice ${invoice.invoiceNumber}`,
        customBody,
        customSignature,
        [{ filename: `Invoice-${invoice.invoiceNumber}.pdf`, content: pdfBuffer }]
      );
    }

    return this.mailService.sendEmailWithAttachment(
      invoice.customerEmail,
      `Tax Invoice ${invoice.invoiceNumber} from Atlas`,
      `Dear ${invoice.customerName}, please find your invoice attached.`,
      `Invoice-${invoice.invoiceNumber}.pdf`,
      pdfBuffer
    );
  }


  // ─── Templates ──────────────────────────────────────────────────────────
  async getTemplates() {
    return this.prisma.invoiceTemplate.findMany();
  }

  async getTemplate(id: string) {
    return this.prisma.invoiceTemplate.findUnique({ where: { id } });
  }

  async createTemplate(data: any) {
    return this.prisma.invoiceTemplate.create({ data });
  }

  async updateTemplate(id: string, data: any) {
    return this.prisma.invoiceTemplate.update({ where: { id }, data });
  }

  // ─── Invoices ───────────────────────────────────────────────────────────
  async getInvoices(status?: any) {
    const where = status ? { status } : {};
    return this.prisma.invoice.findMany({ 
      where, 
      orderBy: { createdAt: 'desc' },
      include: { template: true }
    });
  }

  async getInvoice(id: string) {
    return this.prisma.invoice.findUnique({ 
      where: { id },
      include: { template: true }
    });
  }

  async createInvoice(data: any) {
    return this.prisma.invoice.create({
       data: {
         invoiceNumber: data.invoiceNumber || `INV-${Date.now()}`,
         referenceId: data.referenceId,
         referenceType: data.referenceType,
         customerName: data.customerName,
         customerEmail: data.customerEmail,
         customerPhone: data.customerPhone,
         date: data.date ? new Date(data.date) : new Date(),
         dueDate: data.dueDate ? new Date(data.dueDate) : null,
         status: data.status || 'DRAFT',
         subtotal: data.subtotal || 0,
         taxAmount: data.taxAmount || 0,
         totalAmount: data.totalAmount || 0,
         amountPaid: data.amountPaid || 0,
         tableData: data.tableData || [],
         customFields: data.customFields || {},
         templateId: data.templateId,
         signatureUrl: data.signatureUrl,
         watermarkUrl: data.watermarkUrl
       }
    });
  }

  async updateInvoice(id: string, data: any) {
    return this.prisma.invoice.update({ where: { id }, data });
  }

  async generatePDF(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { template: true }
    });
    
    const storeSettings = await this.prisma.storeSettings.findUnique({ where: { id: 'global' } });
    
    if (!invoice) throw new NotFoundException('Invoice not found');

    // If the invoice has tableData, we can format it for the pdf service
    const formattedInvoice = {
      invoiceNumber: invoice.invoiceNumber,
      date: invoice.date.toISOString(),
      seller: { 
        name: storeSettings?.storeName || 'Atlas', 
        address: storeSettings?.businessAddress || 'Salem, India', 
        state: storeSettings?.businessState || 'Tamil Nadu', 
        gst: storeSettings?.gstNumber || '33AABCU9603R1ZX', 
        email: storeSettings?.supportEmail || 'wholesale@atlas.com',
        website: 'www.atlas.in'
      },
      buyer: { 
        name: invoice.customerName, 
        contact: invoice.customerName, 
        address: 'N/A', 
        gst: 'N/A', 
        phone: invoice.customerPhone || 'N/A' 
      },
      items: Array.isArray(invoice.tableData) ? invoice.tableData.map((it: any) => ({
        description: it.description || it.item || 'Item',
        hsn: it.hsn || 'TEXTILE-00',
        taxPercent: it.tax || 12,
        quantity: it.quantity || 1,
        unitPrice: Number(it.rate || it.price || 0),
        taxableValue: Number(it.amount || it.total || 0)
      })) : [],
      summary: { 
        subtotal: Number(invoice.subtotal), 
        taxes: [{ name: 'GST', amount: Number(invoice.taxAmount) }], 
        grandTotal: Number(invoice.totalAmount), 
        totalGst: Number(invoice.taxAmount) 
      },
      bankDetails: { 
        bankName: 'HDFC Bank', 
        accountName: 'Atlas', 
        accountNumber: '50200012345678', 
        ifscCode: 'HDFC0001234' 
      }
    };

    return this.pdfService.generateInvoicePDF(formattedInvoice);
  }
}
