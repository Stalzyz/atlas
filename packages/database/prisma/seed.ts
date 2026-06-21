import { PrismaClient, OrderStatus, UserRole, WalletTxType, WalletTxReason } from '../generated-client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Comprehensive Diagnostic Seed...');

  // 1. CLEANUP (Optional - only if you want a totally fresh start)
  // await prisma.orderItem.deleteMany();
  // await prisma.order.deleteMany();
  // await prisma.variant.deleteMany();
  // await prisma.product.deleteMany();

  // 2. STORE SETTINGS
  const settings = await prisma.storeSettings.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      storeName: 'Raaghas Luxury',
      tagline: 'Timeless Elegance in Every Thread',
      supportEmail: 'care@raaghas.com',
      businessState: 'Tamil Nadu',
      defaultGstRate: 12.00,
    }
  });
  console.log('✅ Store Settings Ready.');

  // 3. USERS & WALLET
  const testUser = await prisma.user.upsert({
    where: { email: 'tester@raaghas.com' },
    update: {},
    create: {
      email: 'tester@raaghas.com',
      name: 'Raaghas Test Customer',
      role: UserRole.CUSTOMER,
      wallet: {
        create: {
          balance: 5000,
          transactions: {
            create: [
              {
                amount: 5000,
                type: WalletTxType.CREDIT,
                reason: WalletTxReason.REFERRAL_REWARD,
                notes: 'Welcome diagnostic credits'
              }
            ]
          }
        }
      }
    }
  });
  console.log('✅ Test User & Wallet Ready.');

  // 4. PRODUCTS & VARIANTS
  const products = [
    {
      handle: 'royal-kanjivaram-silk-saree',
      title: 'Royal Kanjivaram Silk Saree',
      description: 'Hand-woven pure mulberry silk with zari border.',
      category: 'Saree',
      status: 'PUBLISHED',
      published: true,
      variants: {
        create: [
          {
            sku: 'KJS-RED-XL',
            price: 12500,
            inventory: 50,
            option1Name: 'Size',
            option1Value: 'Free Size',
            option2Name: 'Color',
            option2Value: 'Imperial Red'
          }
        ]
      }
    },
    {
      handle: 'designer-bridal-lehenga',
      title: 'Luxury Bridal Lehenga',
      description: 'Intricate hand embroidery on velvet base.',
      category: 'Lehenga',
      status: 'PUBLISHED',
      published: true,
      variants: {
        create: [
          {
            sku: 'HBL-GOLD-L',
            price: 45000,
            inventory: 10,
            option1Name: 'Size',
            option1Value: 'L',
            option2Name: 'Color',
            option2Value: 'Antique Gold'
          }
        ]
      }
    }
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { handle: p.handle },
      update: {},
      create: p
    });
  }
  console.log('✅ Premium Catalog Injected.');

  // 5. TEST ORDERS
  const variant = await prisma.variant.findFirst();
  if (variant && testUser) {
    await prisma.order.create({
      data: {
        userId: testUser.id,
        customerName: testUser.name!,
        customerEmail: testUser.email,
        customerPhone: '9876543210',
        status: OrderStatus.DELIVERED,
        totalAmount: 12500,
        shippingAddress: {
          city: 'Chennai',
          state: 'Tamil Nadu',
          street: '123 Luxury Lane',
          zip: '600001'
        },
        items: {
          create: [
            {
              variantId: variant.id,
              quantity: 1,
              price: 12500,
              hsnCode: 'SILK-001'
            }
          ]
        },
        activities: {
          create: [
            { type: 'STATUS_CHANGE', message: 'Order delivered successfully during diagnostic test.' }
          ]
        }
      }
    });
  }
  console.log('✅ Test Orders Created.');

  // 6. INVOICE GENERATION
  const lastOrder = await prisma.order.findFirst({ orderBy: { createdAt: 'desc' } });
  if (lastOrder) {
    await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${Date.now()}`,
        referenceId: lastOrder.id,
        referenceType: 'RETAIL',
        customerName: lastOrder.customerName,
        customerEmail: lastOrder.customerEmail,
        customerPhone: lastOrder.customerPhone,
        subtotal: lastOrder.totalAmount,
        taxAmount: 1500,
        totalAmount: 14000,
        status: 'PAID',
        tableData: [
          { item: 'Royal Kanjivaram Silk Saree', qty: 1, price: 12500 }
        ]
      }
    });
  }
  console.log('✅ Diagnostic Invoices Generated.');

  console.log('🎉 LIVE TEST SEED COMPLETE.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
