import { PrismaClient } from './generated-client';

const prisma = new PrismaClient();

async function testCreate() {
  try {
    const data = {
      title: "Test Product",
      description: "",
      shortDescription: "",
      category: "New Arrivals",
      subCategory: "",
      brand: "Raaghas",
      vendor: "",
      productType: "Apparel",
      gender: "Unisex",
      ageGroup: "Adult",
      fabric: "",
      material: "",
      pattern: "",
      fitType: "",
      sleeveType: "",
      neckType: "",
      length: "",
      occasion: "",
      style: "",
      status: "DRAFT",
      basePrice: "0",
      baseMrp: "0",
      baseSku: "",
      hsnCode: "TEXTILE-00",
      taxRate: "12.00",
      tags: "",
      searchKeywords: "",
      seoTitle: "",
      metaDescription: "",
      metaKeywords: "",
      bundleIds: "",
      featuredCoupon: "",
      images: [],
      variants: [
        {
          option1Name: "Size",
          option1Value: "M",
          price: "0",
          mrp: "0",
          sellingPrice: "0",
          costPrice: "0",
          sku: "TEST-SKU",
          barcode: "",
          inventory: 0
        }
      ]
    };

    const { 
      variants, 
      images, 
      collections, 
      price, 
      mrp,
      sellingPrice,
      costPrice,
      inventory, 
      sku, 
      barcode,
      shortDescription,
      basePrice,
      baseMrp,
      baseSku,
      taxRate,
      bundleIds,
      featuredCoupon,
      ...productData 
    } = data as any;

    const handle = "test-handle-" + Date.now();

    const product = await prisma.product.create({
      data: {
        ...productData,
        handle,
        status: productData.status || 'DRAFT',
        variants: {
          create: variants.map((v: any) => ({
            sku: v.sku || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            barcode: v.barcode || null,
            price: Number(v.price || v.sellingPrice || price || 0),
            mrp: Number(v.mrp || mrp || 0),
            sellingPrice: Number(v.sellingPrice || v.price || sellingPrice || 0),
            offerPrice: v.offerPrice ? Number(v.offerPrice) : null,
            costPrice: v.costPrice ? Number(v.costPrice) : null,
            discountPercentage: v.discountPercentage ? Number(v.discountPercentage) : null,
            inventory: Number(v.inventory || inventory || 0),
            option1Name: v.option1Name || 'Size',
            option1Value: v.option1Value || 'Default',
            option2Name: v.option2Name || null,
            option2Value: v.option2Value || null,
            option3Name: v.option3Name || null,
            option3Value: v.option3Value || null,
          }))
        },
        images: {
          create: images || [],
        },
      },
    });

    console.log("Success!", product.id);
  } catch (err: any) {
    console.error("Prisma Error:");
    console.error(err.message);
  } finally {
    await prisma.$disconnect();
  }
}

testCreate();
