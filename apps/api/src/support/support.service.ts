import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService, private mailService: MailService) {}

  async getTickets() {
    return this.prisma.supportInquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async getTicket(id: string) {
    const ticket = await this.prisma.supportInquiry.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async createTicket(data: any) {
    const ticket = await this.prisma.supportInquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        type: data.type || 'GENERAL',
        status: data.status || 'PENDING',
        orderId: data.orderId,
      }
    });

    try {
      const settings = await (this.prisma as any).storeSettings.findUnique({ where: { id: 'global' } });
      const supportEmail = settings?.supportEmail || 'support@grekam.in';

      // Send email to store owner/support
      const adminHtml = `
        <div style="text-align: left;">
          <h2 style="margin: 0 0 20px 0;">New Support Inquiry</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Type:</strong> ${data.type || 'GENERAL'}</p>
          ${data.orderId ? `<p><strong>Order ID:</strong> ${data.orderId}</p>` : ''}
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-left: 3px solid #111;">${data.message}</p>
        </div>
      `;
      this.mailService.sendCustomEmail(supportEmail, `New Inquiry: ${data.subject}`, adminHtml).catch(console.error);

      // Auto-responder to customer
      const customerHtml = `
        <div style="text-align: center;">
          <h1 style="font-size: 28px; margin: 0 0 30px 0;">We've received your inquiry</h1>
          <p style="font-size: 13px; font-weight: 300; margin-bottom: 30px;">Dear ${data.name},<br/><br/>Thank you for contacting Atlas. Our concierge team has received your message regarding "<strong>${data.subject}</strong>" and will respond within 24 hours.</p>
        </div>
      `;
      this.mailService.sendCustomEmail(data.email, `We've received your inquiry | Atlas`, customerHtml).catch(console.error);
    } catch (e) {
      console.error('Failed to send support email:', e);
    }

    return ticket;
  }

  async updateTicketStatus(id: string, status: any) {
    return this.prisma.supportInquiry.update({
      where: { id },
      data: { status }
    });
  }
}
