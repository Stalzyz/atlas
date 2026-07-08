import { PrismaClient } from '../generated-client/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Launching Enterprise-Grade Diagnostic Seed...');

  // 1. STORE SETTINGS (Luxury Configuration)
  await prisma.storeSettings.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      storeName: 'Atlas Luxury',
      tagline: 'Timeless Elegance in Every Thread',
      supportEmail: 'care@atlas.com',
      businessState: 'Tamil Nadu',
      defaultGstRate: 12.00,
    }
  });
  console.log('✅ Store Settings: CONFIGURED');

  // 2. USERS & WALLETS (The Customer Base)
  const customers = [
    { email: 'premium@example.com', name: 'Arjun Kapoor', balance: 25000 },
    { email: 'retail@example.com', name: 'Meera Sharma', balance: 1500 },
    { email: 'tester@atlas.com', name: 'Atlas QA', balance: 5000 },
  ];

  const userIds = [];
  for (const c of customers) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        email: c.email,
        name: c.name,
        role: 'CUSTOMER',
        wallet: {
          create: {
            balance: c.balance,
            transactions: {
              create: [
                {
                  amount: c.balance,
                  type: 'CREDIT',
                  reason: 'REFERRAL_REWARD',
                  notes: 'Onboarding diagnostic balance'
                }
              ]
            }
          }
        }
      }
    });
    userIds.push(user.id);
  }
  console.log('✅ User Base: SYNCHRONIZED');

  // 3. THE LUXURY CATALOG (Diversified Products)
  const productData = [
    {
      handle: 'royal-kanjivaram-silk-saree',
      title: 'Royal Kanjivaram Silk Saree',
      description: 'Hand-woven pure mulberry silk with gold zari border.',
      category: 'Saree',
      variants: [
        { sku: 'KJS-RED', price: 12500, inventory: 45, color: 'Imperial Red' },
        { sku: 'KJS-GOLD', price: 15000, inventory: 20, color: 'Antiquity Gold' }
      ]
    },
    {
      handle: 'bridal-lehenga-maharani',
      title: 'Maharani Velvet Bridal Lehenga',
      description: 'Heavy embroidery with Zardosi work and velvet finish.',
      category: 'Lehenga',
      variants: [
        { sku: 'BL-MHR-VLT', price: 45000, inventory: 5, color: 'Deep Velvet' }
      ]
    },
    {
      handle: 'designer-anarkali-set',
      title: 'Designer Silk Anarkali Set',
      description: 'Elegant floor-length anarkali with matching dupatta.',
      category: 'Anarkali',
      variants: [
        { sku: 'DA-BLUE-L', price: 8500, inventory: 15, color: 'Royal Blue' },
        { sku: 'DA-PINK-M', price: 8500, inventory: 12, color: 'Rose Pink' }
      ]
    }
  ];

  const variantIds = [];
  for (const p of productData) {
    const product = await prisma.product.upsert({
      where: { handle: p.handle },
      update: {},
      create: {
        handle: p.handle,
        title: p.title,
        description: p.description,
        category: p.category,
        status: 'PUBLISHED',
        published: true,
        variants: {
          create: p.variants.map(v => ({
            sku: v.sku,
            price: v.price,
            inventory: v.inventory,
            option1Name: 'Color',
            option1Value: v.color
          }))
        }
      },
      include: { variants: true }
    });
    product.variants.forEach(v => variantIds.push(v.id));
  }
  console.log('✅ Premium Catalog: INJECTED');

  // 4. TRANSACTIONAL HISTORY (Simulated Orders)
  const statuses = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  for (let i = 0; i < 5; i++) {
    const userId = userIds[i % userIds.length];
    const variantId = variantIds[i % variantIds.length];
    const status = statuses[i % statuses.length];
    
    const order = await prisma.order.create({
      data: {
        userId,
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        customerPhone: '9999999999',
        status,
        totalAmount: 10000 + (i * 2000),
        shippingAddress: { city: 'Chennai', state: 'TN', street: '123 Market St', zip: '600001' },
        items: {
          create: [{ variantId, quantity: 1, price: 10000 + (i * 2000) }]
        }
      }
    });

    if (status === 'DELIVERED') {
      await prisma.invoice.create({
        data: {
          invoiceNumber: `INV-2026-${100 + i}`,
          referenceId: order.id,
          referenceType: 'RETAIL',
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          subtotal: order.totalAmount,
          taxAmount: order.totalAmount * 0.12,
          totalAmount: order.totalAmount * 1.12,
          status: 'PAID',
          tableData: [{ item: 'Luxury Apparel', qty: 1, price: order.totalAmount }]
        }
      });
    }
  }
  console.log('✅ Order History: SIMULATED');

  console.log('🎉 ENTERPRISE SEED COMPLETE.');
}

main()
  .catch((e) => {
    console.error('❌ SEED FAILED:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
