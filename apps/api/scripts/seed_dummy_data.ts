import { PrismaClient } from '../../packages/database/generated-client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding dummy data...');

  // 1. Collections
  const collections = ['Bridal Collection', 'Festive Edit', 'Casual Elegance', 'Pure Silk Luxury', 'Summer Breathables'];
  for (const name of collections) {
    await prisma.collection.upsert({
      where: { slug: name.toLowerCase().replace(/ /g, '-') },
      update: {},
      create: {
        title: name,
        slug: name.toLowerCase().replace(/ /g, '-'),
        description: `Explore our beautiful ${name}.`,
        isActive: true,
      }
    });
  }
  console.log('Created collections');

  // 2. Customers (Users)
  const users = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.upsert({
      where: { email: `customer${i}@example.com` },
      update: {},
      create: {
        clerkId: `clerk_dummy_${i}`,
        email: `customer${i}@example.com`,
        name: `Test Customer ${i}`,
        phone: `+91987654321${i % 10}`,
        wallet: { create: { balance: i * 100 } }
      }
    });
    users.push(user);
  }
  console.log('Created customers');

  // 3. Products & Variants
  for (let i = 1; i <= 10; i++) {
    const product = await prisma.product.upsert({
      where: { slug: `dummy-product-${i}` },
      update: {},
      create: {
        title: `Premium Silk Saree ${i}`,
        slug: `dummy-product-${i}`,
        description: 'A beautiful handwoven silk saree perfect for festive occasions.',
        status: 'PUBLISHED',
        hsnCode: '5407',
        taxRate: 5,
        basePrice: 5000 + i * 500,
        compareAtPrice: 6000 + i * 500,
        images: {
          create: [{ url: `https://picsum.photos/seed/saree${i}/600/800`, position: 1 }]
        },
        variants: {
          create: [
            { sku: `SAREE-${i}-S`, title: 'Small', basePrice: 5000 + i * 500 },
            { sku: `SAREE-${i}-M`, title: 'Medium', basePrice: 5000 + i * 500 },
            { sku: `SAREE-${i}-L`, title: 'Large', basePrice: 5000 + i * 500 }
          ]
        }
      },
      include: { variants: true }
    });

    // Add stock
    for (const v of product.variants) {
      await prisma.stockLocation.create({
        data: {
          variantId: v.id,
          locationId: 'main-warehouse', // Requires warehouse, we'll create it
          quantity: 50,
          type: 'ON_HAND'
        }
      }).catch(() => {}); // ignore if exists
    }
  }
  console.log('Created products and stock');

  // 4. Discounts
  await prisma.discountCode.upsert({
    where: { code: 'WELCOME50' },
    update: {},
    create: { code: 'WELCOME50', type: 'PERCENTAGE', value: 50, isActive: true }
  });
  await prisma.discountCode.upsert({
    where: { code: 'FLAT1000' },
    update: {},
    create: { code: 'FLAT1000', type: 'FIXED', value: 1000, isActive: true }
  });
  console.log('Created discounts');

  // 5. CMS Pages
  await prisma.page.upsert({
    where: { slug: 'about-us' },
    update: {},
    create: { title: 'About Us', slug: 'about-us', content: '<p>Welcome to Raaghas.</p>', isPublished: true }
  });
  console.log('Created pages');

  // 6. Orders
  const variants = await prisma.variant.findMany({ take: 5 });
  const statuses = ['CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'PROCESSING'];
  if (variants.length > 0) {
    for (let i = 0; i < 20; i++) {
      const user = users[i % users.length];
      const variant = variants[i % variants.length];
      await prisma.order.create({
        data: {
          userId: user.id,
          status: statuses[i % statuses.length] as any,
          financialStatus: 'paid',
          fulfillmentStatus: statuses[i % statuses.length] === 'SHIPPED' ? 'fulfilled' : 'unfulfilled',
          totalAmount: variant.basePrice,
          subtotal: variant.basePrice,
          total: variant.basePrice,
          customerName: user.name || 'Test User',
          customerEmail: user.email,
          customerPhone: user.phone || '9999999999',
          shippingAddress: { address: '123 Test St', city: 'Hyderabad', pincode: '500034', state: 'Telangana' },
          paymentMethod: 'razorpay',
          paymentId: `pay_${randomUUID().slice(0, 10)}`,
          paymentIntentId: `order_${randomUUID().slice(0, 10)}`,
          items: {
            create: [{
              variantId: variant.id,
              quantity: 1,
              price: variant.basePrice,
              hsnCode: '5407'
            }]
          }
        }
      });
    }
    console.log('Created orders');
  }

  // 7. Invoices (Draft & Paid)
  for (let i = 1; i <= 5; i++) {
    await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-2026-${String(i).padStart(4, '0')}`,
        date: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: i % 2 === 0 ? 'PAID' : 'DRAFT',
        customerName: `Wholesale Client ${i}`,
        customerEmail: `client${i}@wholesale.com`,
        customerPhone: '9876543210',
        subtotal: 50000,
        taxAmount: 2500,
        totalAmount: 52500,
        tableData: [
          { item: 'Premium Silk Saree Set', hsn: '5407', quantity: 10, rate: 5000, tax: 5, amount: 50000 }
        ],
        notes: 'Thank you for your business.'
      }
    });
  }
  console.log('Created invoices');

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch(e => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
