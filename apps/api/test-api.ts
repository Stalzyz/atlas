import * as jwt from 'jsonwebtoken';

const secret = '87AkYYOOGO2mM8gzBOGVRGjK0Io+0MidlPPZNgdwetU88pzxNwkbQvlemYHcjSb0';
const token = jwt.sign({ sub: 'cmpnqjocv0000uuu6tb0r8fhj', email: 'admin@raaghas.in', role: 'SUPER_ADMIN', permissions: ['products:write'] }, secret);

async function testApi() {
  const data = {
    title: "Test Product API " + Date.now(),
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
        sku: "TEST-SKU-API-" + Date.now(),
        barcode: "",
        inventory: 0
      }
    ]
  };

  try {
    const res = await fetch('http://localhost:6005/api/v1/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (err: any) {
    console.error("Fetch error:", err.message);
  }
}

testApi();
