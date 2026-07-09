import { PrismaClient, OrderStatus, UserRole, RetailerTier, RetailerStatus, ShipmentStatus } from '@atlas/database';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting dummy data seed...');

  console.log('Cleaning up existing dummy data...');

  const password = await bcrypt.hash('Password123!', 10);
  console.log('Creating users...');
  
  const customer1 = await prisma.user.upsert({
    where: { email: 'aarav.sharma@example.com' },
    update: {},
    create: {
      email: 'aarav.sharma@example.com',
      password,
      name: 'Aarav Sharma',
      role: UserRole.CUSTOMER,
      phone: '+919876543210',
      wallet: { create: { balance: 500 } }
    }
  });

  const customer2 = await prisma.user.upsert({
    where: { email: 'priya.patel@example.com' },
    update: {},
    create: {
      email: 'priya.patel@example.com',
      password,
      name: 'Priya Patel',
      role: UserRole.CUSTOMER,
      phone: '+919876543211',
      wallet: { create: { balance: 1500 } }
    }
  });

  // Create Retailer Profile for B2B (independent table)
  const retailer = await prisma.retailer.upsert({
    where: { email: 'vikram.singh@example.com' },
    update: {},
    create: {
      email: 'vikram.singh@example.com',
      businessName: 'Singh Boutiques Pvt Ltd',
      contactName: 'Vikram Singh',
      phone: '+919876543212',
      gstNumber: '29ABCDE1234F1Z5',
      tier: RetailerTier.GOLD,
      status: RetailerStatus.ACTIVE,
      creditLimit: 500000,
    }
  });

  console.log('Creating shipping zones & couriers...');
  const zoneIndia = await prisma.shippingZone.upsert({
    where: { name: 'India (Domestic)' },
    update: {},
    create: {
      name: 'India (Domestic)',
      regions: ['IN'],
      isActive: true,
      methods: {
        create: [
          { name: 'Standard Delivery', baseCost: 100, minOrderValue: 0 },
          { name: 'Express Delivery', baseCost: 250, minOrderValue: 0 }
        ]
      }
    }
  });

  const courier1 = await prisma.courier.upsert({
    where: { name: 'BlueDart' },
    update: {},
    create: { name: 'BlueDart', trackingUrl: 'https://bluedart.com/tracking?id=' }
  });
  
  console.log('Creating size guides...');
  const sizeGuideMen = await prisma.sizeGuide.upsert({
    where: { name: 'Men - Upper Body' },
    update: {},
    create: { name: 'Men - Upper Body', htmlContent: '<table><tr><th>Size</th><th>Chest (in)</th></tr><tr><td>S</td><td>38</td></tr><tr><td>M</td><td>40</td></tr><tr><td>L</td><td>42</td></tr></table>' }
  });

  console.log('Creating products...');
  const collection1 = await prisma.collection.upsert({
    where: { handle: 'ethnic-wear' },
    update: {},
    create: { title: 'Ethnic Wear', handle: 'ethnic-wear', description: 'Premium Indian ethnic wear' }
  });

  const product1 = await prisma.product.upsert({
    where: { handle: 'jaipur-block-print-kurta' },
    update: {},
    create: {
      title: 'Jaipur Block Print Kurta',
      handle: 'jaipur-block-print-kurta',
      description: 'Handcrafted cotton kurta from Jaipur.',
      vendor: 'Atlas Originals',
      published: true,
      tags: 'kurta, cotton, summer',
      sizeGuideId: sizeGuideMen.id,
      collections: { connect: [{ id: collection1.id }] },
      variants: {
        create: [
          { option1Value: 'S', sku: 'JP-KURTA-S', price: 2499, inventory: 50 },
          { option1Value: 'M', sku: 'JP-KURTA-M', price: 2499, inventory: 30 }
        ]
      },
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=800', altText: 'Jaipur Kurta', position: 0 }
        ]
      }
    }
  });

  // Reviews for product1
  await prisma.review.create({
    data: {
      productId: product1.id,
      userId: customer1.id,
      rating: 5,
      headline: 'Amazing Quality',
      content: 'The cotton is incredibly soft and the print is beautiful.',
      approved: true,
    }
  });

  console.log('Creating orders...');
  const variants = await prisma.variant.findMany({ where: { productId: product1.id } });

  if (variants.length > 0) {
    // B2C Order 1
    const order1 = await prisma.order.create({
      data: {
        userId: customer1.id,
        status: OrderStatus.CONFIRMED,
        totalAmount: 2599,
        customerName: 'Aarav Sharma',
        customerEmail: customer1.email,
        customerPhone: customer1.phone || '',
        shippingAddress: {
          name: 'Aarav Sharma',
          street: '123 MG Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India'
        },
        items: {
          create: [
            {
              variantId: variants[0].id,
              quantity: 1,
              price: 2499,
            }
          ]
        }
      }
    });

    // Create Invoice
    await prisma.invoice.create({
      data: {
        referenceId: order1.id,
        referenceType: 'ORDER',
        invoiceNumber: `INV-${Date.now()}-1`,
        customerName: 'Aarav Sharma',
        customerEmail: customer1.email,
        subtotal: 2499,
        taxAmount: 0,
        totalAmount: 2599,
        amountPaid: 2599,
        status: 'PAID',
        tableData: [{ item: 'Jaipur Block Print Kurta', quantity: 1, price: 2499 }]
      }
    });

    // Create Fulfillment & Shipment
    const fulfillment1 = await prisma.fulfillment.create({
      data: {
        orderId: order1.id,
        status: 'SHIPPED',
        items: {
          create: [{ variantId: variants[0].id, quantity: 1 }]
        }
      }
    });

    await prisma.shipment.create({
      data: {
        fulfillmentId: fulfillment1.id,
        courierId: courier1.id,
        trackingId: `BLD${Date.now()}`,
        status: ShipmentStatus.IN_TRANSIT,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      }
    });

    // B2B Order
    const order2 = await prisma.order.create({
      data: {
        userId: null,
        status: OrderStatus.DELIVERED,
        totalAmount: 49980,
        customerName: 'Vikram Singh',
        customerEmail: 'vikram.singh@example.com',
        customerPhone: '+919876543212',
        shippingAddress: {
          name: 'Vikram Singh',
          street: '45 Connaught Place',
          city: 'New Delhi',
          state: 'Delhi',
          postalCode: '110001',
          country: 'India'
        },
        items: {
          create: [
            {
              variantId: variants[1].id,
              quantity: 20,
              price: 2499,
            }
          ]
        }
      }
    });
  }

  console.log('Creating email templates...');
  await prisma.emailTemplate.upsert({
    where: { type: 'DUMMY_ORDER_CONFIRMATION' },
    update: {},
    create: {
      name: 'Dummy Order Confirmation',
      type: 'DUMMY_ORDER_CONFIRMATION',
      subject: 'Your Atlas Order #{{orderId}} is Confirmed',
      body: '<h1>Thank you for your order, {{name}}!</h1><p>We are getting it ready.</p>'
    }
  });

  console.log('Creating referrals...');
  await prisma.referral.upsert({
    where: { refereeId: customer2.id },
    update: {},
    create: {
      referrerId: customer1.id,
      refereeId: customer2.id,
      status: 'REWARDED',
      rewardAmount: 500
    }
  });

  console.log('Dummy data seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
