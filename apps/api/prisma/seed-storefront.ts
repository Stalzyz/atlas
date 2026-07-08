import { PrismaClient } from '@atlas/database';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting Storefront Transformation...");

  // 1. Update Global Theme for "Royal Wine & Ivory"
  const themeConfig = {
    storeName: "Atlas",
    defaultThemeMode: "LIGHT",
    fontHeading: "serif",
    fontBody: "sans",
    buttonRadius: "9999px", // Luxury rounded buttons
    
    // Light Tokens (Royal Wine & Ivory)
    light_primaryColor: "#28104E", // Royal Wine
    light_bg: "#FDFBF7",          // Ivory
    light_surface: "#FFFFFF",
    light_textPrimary: "#1A1A1A",
    light_textSecondary: "#666666",
    light_border: "#E8E1D5",      // Subtle ivory border
    light_glassBg: "rgba(255, 255, 255, 0.7)",
    light_glassBorder: "rgba(112, 26, 49, 0.1)",
    
    announcementBar: "✨ FIRST ORDER EXCLUSIVE: USE CODE 'ATLAS10' FOR 10% OFF ✨",
    footerText: "© 2026 Atlas Artisanal Wear. Handcrafted in India.",
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
            { label: "About Atlas", href: "/pages/about" },
            { label: "The Kalamkari Art", href: "/pages/artisan-stories" },
            { label: "Contact Us", href: "/pages/contact" }
          ]
        }
      ]
    }
  };

  const themeData = {
    storeName: "Atlas",
    primaryColor: "#28104E",
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
  const sectionsData: any[] = [];

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
