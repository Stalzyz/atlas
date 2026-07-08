import { API_URL } from "@/lib/api";

import { SectionRenderer } from "@/components/sections/SectionRenderer";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Section {
  id: string;
  type: string;
  order: number;
  content: Record<string, any>;
}

// ─── Static fallback data (used when API/DB is not available yet) ─────────────

const FALLBACK_SECTIONS: Section[] = [
  { 
    id: "category-strip", 
    type: "CATEGORY_STRIP", 
    order: 0, 
    content: {
      categories: [
        { label: "Men", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&h=200&fit=crop", link: "/collections/men" },
        { label: "Women", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=200&fit=crop", link: "/collections/women" },
        { label: "Kids", image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=200&h=200&fit=crop", link: "/collections/kids" },
        { label: "Beauty", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54c28?w=200&h=200&fit=crop", link: "/collections/beauty" },
        { label: "Home", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&h=200&fit=crop", link: "/collections/home" },
        { label: "Studio", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop", link: "/collections/studio" }
      ]
    } 
  },
  { 
    id: "hero-banner", 
    type: "BANNER", 
    order: 1, 
    content: {
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200",
      mobileImage: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800",
      headline: "END OF REASON SALE",
      subheadline: "50-80% OFF ON TOP BRANDS",
      ctaText: "Shop Now",
      ctaLink: "/collections/all"
    } 
  },
  { 
    id: "deal-of-the-day", 
    type: "PRODUCT_GRID", 
    order: 2, 
    content: { 
      title: "DEAL OF THE DAY", 
      count: 4, 
      collectionHandle: "all" 
    } 
  },
  { 
    id: "biggest-deals", 
    type: "IMAGE_ROW", 
    order: 3, 
    content: {
      title: "BIGGEST DEALS ON TOP BRANDS",
      images: [
        { url: "https://images.unsplash.com/photo-1551028719-01c1eb5a8b4f?w=600&h=600&fit=crop", link: "/collections/all" },
        { url: "https://images.unsplash.com/photo-1560243563-062bfc001d68?w=600&h=600&fit=crop", link: "/collections/all" },
        { url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=600&fit=crop", link: "/collections/all" },
        { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop", link: "/collections/all" }
      ]
    } 
  },
  { 
    id: "shop-by-category", 
    type: "CATEGORIES_MOSAIC", 
    order: 4, 
    content: {
      headline: "SHOP BY CATEGORY",
      subheadline: "",
      categories: [
        { id: "1", label: "Western Wear", handle: "western-wear", image: "https://images.unsplash.com/photo-1485230895905-31d011684ac9?q=80&w=800", size: "large" },
        { id: "2", label: "Ethnic Wear", handle: "ethnic-wear", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600", size: "small" },
        { id: "3", label: "Activewear", handle: "activewear", image: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?q=80&w=600", size: "small" },
        { id: "4", label: "Footwear", handle: "footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800", size: "medium" }
      ]
    } 
  },
  { 
    id: "trust", 
    type: "TRUST_BAR", 
    order: 5, 
    content: {
      items: [
        { icon: "CheckCircle", text: "100% ORIGINAL guarantee" },
        { icon: "RefreshCcw", text: "Return within 14days" },
        { icon: "Truck", text: "Get free delivery" },
        { icon: "CreditCard", text: "Secure payments" }
      ]
    } 
  }
];

// ─── Data Fetching ────────────────────────────────────────────────────────────

async function getHomePageData(): Promise<any> {
  try {
    const res = await fetch(`${API_URL}/api/v1/cms/pages/home`, {
      next: { revalidate: 60 }, // ISR: Cache for 60 seconds
    });
    if (!res.ok) throw new Error("API unavailable");
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<import("next").Metadata> {
  const page = await getHomePageData();
  if (page) {
    return {
      title: page.metaTitle || page.title || "Atlas | Authentic Handloom",
      description: page.metaDescription,
      openGraph: {
        images: page.ogImage ? [{ url: page.ogImage }] : [],
      }
    };
  }
  return {}; // Falls back to layout metadata
}

export default async function Home() {
  const page = await getHomePageData();
  const sections = page?.sections && page.sections.length > 0 ? page.sections : FALLBACK_SECTIONS;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Atlas",
    "url": "https://atlas.grekam.in",
    "logo": "https://atlas.grekam.in/logo-dark.svg",
    "description": "Atlas is India's leading luxury brand for premium casual and office wear."
  };

  return (
    <main className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <h1 className="sr-only">Atlas is India's leading luxury brand for premium casual and office wear.</h1>
      <div className="md:pt-0">
        <SectionRenderer sections={sections} />
      </div>
    </main>
  );
}
