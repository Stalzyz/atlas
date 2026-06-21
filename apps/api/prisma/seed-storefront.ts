import { PrismaClient } from '@raaghas/database';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting Storefront Transformation...");

  // 1. Update Global Theme for "Royal Wine & Ivory"
  const themeConfig = {
    storeName: "Raaghas",
    defaultThemeMode: "LIGHT",
    fontHeading: "serif",
    fontBody: "sans",
    buttonRadius: "9999px", // Luxury rounded buttons
    
    // Light Tokens (Royal Wine & Ivory)
    light_primaryColor: "#701A31", // Royal Wine
    light_bg: "#FDFBF7",          // Ivory
    light_surface: "#FFFFFF",
    light_textPrimary: "#1A1A1A",
    light_textSecondary: "#666666",
    light_border: "#E8E1D5",      // Subtle ivory border
    light_glassBg: "rgba(255, 255, 255, 0.7)",
    light_glassBorder: "rgba(112, 26, 49, 0.1)",
    
    announcementBar: "✨ FIRST ORDER EXCLUSIVE: USE CODE 'RAAGHAS10' FOR 10% OFF ✨",
    footerText: "© 2026 Raaghas Artisanal Wear. Handcrafted in India.",
    footerTagline: "Elevating everyday office wear with the timeless art of Kalamkari.",
    showSocialsInFooter: true,
    
    footerConfig: {
      sections: [
        {
          title: "The Collection",
          links: [
            { label: "Office Kurtis", href: "/collections/office-wear" },
            { label: "Kalamkari Specials", href: "/collections/kalamkari" },
            { label: "New Arrivals", href: "/collections/new-arrivals" },
            { label: "Bestsellers", href: "/collections/best-sellers" }
          ]
        },
        {
          title: "Customer Care",
          links: [
            { label: "Shipping Policy", href: "/pages/shipping" },
            { label: "Returns & Exchanges", href: "/pages/returns" },
            { label: "Size Guide", href: "/pages/size-guide" },
            { label: "Track Order", href: "/account/orders" }
          ]
        },
        {
          title: "Our Story",
          links: [
            { label: "About Raaghas", href: "/pages/about" },
            { label: "The Kalamkari Art", href: "/pages/artisan-stories" },
            { label: "Contact Us", href: "/pages/contact" }
          ]
        }
      ]
    }
  };

  const themeData = {
    storeName: "Raaghas",
    primaryColor: "#701A31",
    fontHeading: "serif",
    fontBody: "sans",
    buttonRadius: "9999px",
    config: themeConfig as any,
    footerConfig: themeConfig.footerConfig as any
  };

  await prisma.themeSettings.upsert({
    where: { id: "global" },
    update: themeData,
    create: { id: "global", ...themeData }
  });

  // 2. Define High-Conversion Sections
  const sectionsData = [
    {
      type: "HERO",
      order: 0,
      content: {
        variant: "aesthetic",
        headline: "The Art of\\nProfessionalism.",
        subheadline: "Elevate your office wardrobe with handcrafted Kalamkari kurtis. Breathable luxury for the modern workspace.",
        primaryCta: { text: "Shop Office Wear", link: "/collections/office-wear" },
        secondaryCta: { text: "Discover Kalamkari", link: "/collections/kalamkari" },
        uiElements: [
          { x: 85, y: 15, size: 1, opacity: 0.6, speed: 0.4, iconName: "LuxuryHanger", shape: "rounded" },
          { x: 15, y: 85, size: 0.8, opacity: 0.6, speed: 0.2, text: "ARTISANAL", subtext: "KALAMKARI", shape: "circle" }
        ],
        fabrics: [
          { x: 20, y: 30, opacity: 0.1, speed: 0.2, scale: 1 },
          { x: 75, y: 65, opacity: 0.08, speed: 0.3, scale: 1.2 }
        ]
      },
      style: { backgroundColor: "#FDFBF7", textColor: "#701A31", padding: 0 }
    },
    {
      type: "TRUST_BAR",
      order: 1,
      content: {
        items: [
          { icon: "Truck", text: "Free Shipping on First Order" },
          { icon: "CheckCircle", text: "Hand-Painted Kalamkari" },
          { icon: "Clock", text: "7-Day Easy Exchange" },
          { icon: "Shield", text: "Secured Payments" }
        ]
      },
      style: { backgroundColor: "#FFFFFF", textColor: "#701A31", padding: 20 }
    },
    {
      type: "CATEGORY_STRIP",
      order: 2,
      content: {
        categories: [
          { title: "Office Kurtis", handle: "office-wear", image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=400" },
          { title: "Pure Cotton", handle: "cotton-wear", image: "https://images.unsplash.com/photo-1610030469983-98e550d615e1?q=80&w=400" },
          { title: "Silk Kalamkari", handle: "silk-kalamkari", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=400" },
          { title: "New Drops", handle: "new-arrivals", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400" }
        ]
      },
      style: { backgroundColor: "#FDFBF7", padding: 40 }
    },
    {
      type: "PRODUCT_GRID",
      order: 3,
      content: { title: "Trending Office Wear", collectionHandle: "office-wear", count: 4 },
      style: { textAlign: "center", padding: 60 }
    },
    {
      type: "DEAL_BANNER",
      order: 4,
      content: { 
        headline: "WELCOME TO RAAGHAS – FLAT 10% OFF", 
        subtext: "Exclusively for your first purchase. Use code: RAAGHAS10", 
        ctaText: "Claim Discount", 
        ctaLink: "/collections/all" 
      },
      style: { backgroundColor: "#701A31", textColor: "#FFFFFF", padding: 40 }
    },
    {
      type: "AOV_BUNDLES",
      order: 5,
      content: { 
        headline: "The Perfect Office Capsule", 
        subheadline: "Complete your look with our curated bundles.",
        bundles: [] 
      },
      style: { backgroundColor: "#FDFBF7", padding: 60 }
    },
    {
      type: "SOCIAL_PROOF",
      order: 6,
      content: { 
        headline: "Styling the Raaghas Woman", 
        subtext: "Tag us @raaghas.official to get featured.",
        items: [
          { url: "https://images.unsplash.com/photo-1594235412402-b1ed2efaa873?q=80&w=400", handle: "@riya_style" },
          { url: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=400", handle: "@corporate_chic" },
          { url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400", handle: "@priya_v" },
          { url: "https://images.unsplash.com/photo-1610030469983-98e550d615e1?q=80&w=400", handle: "@modern_ethnic" }
        ]
      },
      style: { padding: 60 }
    },
    {
      type: "TESTIMONIALS",
      order: 7,
      content: { 
        headline: "What Women are Saying",
        testimonials: [
          { name: "Ananya K.", quote: "The most breathable kurti I've ever worn. Perfect for 9-hour shifts.", rating: 5 },
          { name: "Meera R.", quote: "The Kalamkari print is so authentic. I get compliments every time I wear it to meetings.", rating: 5 },
          { name: "Sonal V.", quote: "Royal Wine is my new favorite color. The fit is absolute perfection.", rating: 5 }
        ]
      },
      style: { backgroundColor: "#FDFBF7", padding: 80 }
    },
    {
      type: "INSTAGRAM_FEED",
      order: 8,
      content: { 
        headline: "Follow Our Journey", 
        url: "https://instagram.com/raaghas.official", 
        handleText: "@raaghas.official" 
      },
      style: { padding: 40 }
    },
    {
      type: "NEWSLETTER",
      order: 9,
      content: { 
        headline: "Join the Inner Circle", 
        body: "Subscribe for early access to limited Kalamkari drops and secret sales." 
      },
      style: { backgroundColor: "#701A31", textColor: "#FFFFFF", padding: 80 }
    }
  ];

  const homePage = await prisma.page.upsert({
    where: { handle: "home" },
    update: { title: "Home", status: "PUBLISHED" },
    create: { handle: "home", title: "Home", type: "LANDING", status: "PUBLISHED" }
  });

  // Delete old sections and create new ones
  await prisma.section.deleteMany({ where: { pageId: homePage.id } });
  
  await prisma.section.createMany({
    data: sectionsData.map(s => ({
      pageId: homePage.id,
      type: s.type as any,
      order: s.order,
      content: s.content as any,
      style: s.style as any
    }))
  });

  console.log("✅ Storefront Seeded Successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
