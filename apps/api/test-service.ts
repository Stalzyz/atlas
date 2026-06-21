import { PrismaClient } from './generated-client';
import { ProductService } from './src/products/products.service';

const prisma = new PrismaClient();
const productService = new ProductService(prisma as any);

async function testCreate() {
  try {
    const data = {
      title: "Test Product Service",
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
      images: [{ url: "http://example.com/1.png", isPrimary: true }],
      variants: [
        {
          option1Name: "Size",
          option1Value: "M",
          price: "0",
          mrp: "0",
          sellingPrice: "0",
          costPrice: "0",
          sku: "TEST-SKU-SERVICE",
          barcode: "",
          inventory: 0
        }
      ]
    };

    const product = await productService.create(data);
    console.log("Success!", product.id);
  } catch (err: any) {
    console.error("Error from ProductService:");
    console.error(err.message);
  } finally {
    await prisma.$disconnect();
  }
}

testCreate();
