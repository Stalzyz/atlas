import { PrismaClient } from './generated-client';
import { MailService } from './src/mail/mail.service';

const prisma = new PrismaClient();

async function run() {
  const mailService = new MailService(prisma as any);
  
  // Try sending a test email
  const toEmail = 'contact@raaghas.in'; // We'll use the contact email for testing
  const customerName = 'Stalin Kumar';
  const orderId = 'TEST-123456';
  const amount = 2500;

  console.log(`Sending test refund email to ${toEmail}...`);
  const result = await mailService.sendRefundInitiatedEmail(toEmail, customerName, orderId, amount);
  console.log('Result:', result);
}

run()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('Error sending test email:', e);
    prisma.$disconnect();
  });
