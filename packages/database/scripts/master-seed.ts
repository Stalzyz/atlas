import { PrismaClient, OrderStatus, UserRole } from '../generated-client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 INITIALIZING TYPE-SAFE MASTER SEED v2.0...');

  // --- PHASE 1: USERS ---
  console.log('👥 Phase 1: Creating Users...');
  await prisma.user.upsert({
    where: { email: 'admin@raaghas.com' },
    update: {},
    create: {
      email: 'admin@raaghas.com',
      name: 'Raaghas Admin',
      phone: '9876543210',
      role: UserRole.ADMIN,
    },
  });

  const customers = [
    { email: 'user1@test.com', name: 'Aravind Kumar' },
    { email: 'user2@test.com', name: 'Meera Reddy' },
    { email: 'user3@test.com', name: 'Sanjay Sharma' },
  ];

  const dbUsers = [];
  for (const c of customers) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        email: c.email,
        name: c.name,
        phone: '90000' + Math.floor(Math.random() * 100000),
        role: UserRole.CUSTOMER,
        savedAddresses: [
          {
            type: 'SHIPPING',
            line1: '123 Test Street',
            city: 'Chennai',
            state: 'Tamil Nadu',
            postalCode: '600001',
            country: 'India',
            isDefault: true,
          }
        ]
      },
    });
    dbUsers.push(user);
  }

  // --- PHASE 2: PRODUCTS ---
  console.log('🛍️ Phase 2: Creating Luxury Ethnic Collection...');
  
  const collection = await prisma.collection.upsert({
    where: { handle: 'festive-2026' },
    update: {},
    create: { title: 'Festive Collection 2026', handle: 'festive-2026' }
  });

  const productTemplates = [
    { title: 'Royal Kanjivaram Silk Saree', price: 12000, hsn: '5007' },
    { title: 'Midnight Blue Banarasi', price: 15000, hsn: '5007' },
    { title: 'Floral Printed Cotton Kurti', price: 1200, hsn: '6204' },
    { title: 'Emerald Green Anarkali', price: 4500, hsn: '6204' },
    { title: 'Ruby Red Wedding Lehenga', price: 45000, hsn: '6204' },
  ];

  const dbProducts = [];
  for (let i = 0; i < 20; i++) {
    const template = productTemplates[i % productTemplates.length];
    const product = await prisma.product.create({
      data: {
        title: `${template.title} - Ed. ${Math.floor(i / 5) + 1}`,
        handle: `${template.title.toLowerCase().replace(/ /g, '-')}-${i}-${Date.now()}`,
        description: 'Premium handcrafted luxury ethnic wear from Raaghas.',
        published: i >= 3,
        status: i < 3 ? 'DRAFT' : 'PUBLISHED',
        hsnCode: template.hsn,
        category: i % 2 === 0 ? 'Saree' : 'Kurti',
        variants: {
          create: [
            { 
              sku: `SKU-${i}-GLD-${Date.now()}`, 
              price: template.price, 
              mrp: template.price * 1.2,
              sellingPrice: template.price * 0.9,
              inventory: i < 3 ? 0 : (i < 6 ? 2 : 50),
              option1Name: 'Size',
              option1Value: 'FS',
              option2Name: 'Color',
              option2Value: 'Gold'
            }
          ]
        },
        images: {
          create: [{ url: 'https://images.unsplash.com/photo-1610030469668-93530c176cce', altText: template.title, position: 1 }]
        }
      },
      include: { variants: true }
    });
    dbProducts.push(product);
  }

  // --- PHASE 3: ORDERS ---
  console.log('📦 Phase 3: Generating Orders & Invoices...');
  
  for (let i = 0; i < 8; i++) {
    const user = dbUsers[i % dbUsers.length];
    const product = dbProducts[i % dbProducts.length];
    const variant = product.variants[0];
    
    const status = i < 2 ? OrderStatus.PAYMENT_PENDING : (i < 5 ? OrderStatus.CONFIRMED : OrderStatus.CANCELLED);
    const financialStatus = i < 5 ? 'paid' : 'pending';

    const order = await prisma.order.upsert({
      where: { id: `ORD-${202600 + i}` },
      update: {},
      create: {
        id: `ORD-${202600 + i}`,
        userId: user.id,
        totalAmount: Number(variant.sellingPrice || variant.price),
        status: status,
        financialStatus: financialStatus,
        customerName: user.name || 'Test User',
        customerEmail: user.email,
        customerPhone: user.phone || '9876543210',
        shippingAddress: {
          name: user.name,
          line1: '456 Order Ave',
          city: 'Chennai',
          state: 'TN',
          postalCode: '600001',
          country: 'IN'
        },
        items: {
          create: [{
            variantId: variant.id,
            quantity: 1,
            price: variant.sellingPrice || variant.price,
            hsnCode: product.hsnCode
          }]
        }
      }
    });

    if (financialStatus === 'paid') {
      await prisma.invoice.upsert({
        where: { invoiceNumber: `INV-${202600 + i}` },
        update: {},
        create: {
          invoiceNumber: `INV-${202600 + i}`,
          customerName: user.name || 'Test User',
          customerEmail: user.email,
          customerPhone: user.phone,
          subtotal: variant.sellingPrice || variant.price,
          taxAmount: Number(variant.sellingPrice || variant.price) * 0.12,
          totalAmount: Number(variant.sellingPrice || variant.price) * 1.12,
          status: 'PAID',
          tableData: [
            { title: product.title, quantity: 1, price: variant.sellingPrice, hsn: product.hsnCode }
          ]
        }
      });
    }
  }

  // --- PHASE 4: MENUS ---
  console.log('🍔 Phase 4: Creating Menus...');
  await prisma.menu.upsert({
    where: { handle: 'header-main' },
    update: {},
    create: {
      name: 'Main Header Navigation',
      handle: 'header-main',
      items: {
        create: [
          { label: 'Home', url: '/', order: 0 },
          { label: 'Shop', url: '/shop', order: 1 },
          { label: 'Collections', url: '/collections', order: 2 },
          { label: 'About Us', url: '/about', order: 3 },
          { label: 'Contact', url: '/contact', order: 4 },
        ]
      }
    }
  });

  await prisma.menu.upsert({
    where: { handle: 'footer-shop' },
    update: {},
    create: {
      name: 'Footer Shop Navigation',
      handle: 'footer-shop',
      items: {
        create: [
          { label: 'New Arrivals', url: '/shop?sort=new', order: 0 },
          { label: 'Best Sellers', url: '/shop?sort=popular', order: 1 },
          { label: 'Sale', url: '/shop?sale=true', order: 2 },
        ]
      }
    }
  });

  console.log('✅ TYPE-SAFE SEEDING COMPLETE. PLATFORM READY FOR TESTING.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
