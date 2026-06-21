import { Controller, Get, Post, Param, Body, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../auth/public.decorator';

@Controller('cms/presets')
export class ThemePresetsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @Public()
  async getPresets() {
    return this.prisma.themePreset.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  @Post(':id/apply')
  @Public()
  async applyPreset(@Param('id') id: string) {
    const preset = await this.prisma.themePreset.findUnique({
      where: { id }
    });

    if (!preset) throw new NotFoundException('Preset not found');

    const config: any = preset.config;
    const themeData = config.theme;
    const sectionsData = config.sections;

    return this.prisma.$transaction(async (tx) => {
      // 1. Update Global Theme Settings
      await tx.themeSettings.upsert({
        where: { id: 'global' },
        update: themeData,
        create: { id: 'global', ...themeData }
      });

      // 2. Find or Create Homepage
      const page = await tx.page.upsert({
        where: { handle: 'home' },
        update: { title: 'Home', status: 'PUBLISHED' },
        create: { handle: 'home', title: 'Home', status: 'PUBLISHED' }
      });

      // 3. Clear existing sections
      await tx.section.deleteMany({
         where: { pageId: page.id }
      });

      // 4. Create new sections from preset
      if (sectionsData && sectionsData.length > 0) {
        await tx.section.createMany({
          data: sectionsData.map((sec: any, index: number) => ({
            pageId: page.id,
            type: sec.type,
            order: index,
            content: sec.content || {},
            style: sec.style || {},
            settings: sec.settings || {}
          }))
        });
      }

      // 5. Update active status
      await tx.themePreset.updateMany({
        where: { id: { not: id } },
        data: { isActive: false }
      });
      await tx.themePreset.update({
        where: { id },
        data: { isActive: true }
      });

      return { success: true, message: `Theme ${preset.name} applied successfully` };
    });
  }

  @Post('seed')
  @Public()
  async seedPresets() {
    const flagshipPresets = [
      {
        name: "Minimal Luxury",
        description: "Ivory and charcoal palette with serif headings and plenty of whitespace. Ideal for high-end cotton collections.",
        previewImage: "https://images.unsplash.com/photo-1620706859477-e56216b7609a?q=80&w=800",
        config: {
          theme: {
            primaryColor: "#2D2926",
            secondaryColor: "#FDFBF7",
            fontHeading: "serif",
            fontBody: "sans",
            buttonRadius: "0rem"
          },
          sections: [
            { 
              type: "HERO", 
              content: { 
                variant: "infinite_canvas", 
                headline: "The Art of Simplicity.", 
                subheadline: "Hand-crafted cottons for the modern minimalist.",
                ctaText: "Discover the Edit",
                cutoutImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800"
              } 
            },
            { type: "TRUST_BAR", content: { items: [{ icon: "Shield", text: "Quality Guaranteed" }, { icon: "Truck", text: "Global Shipping" }, { icon: "Star", text: "Artisan Made" }] } },
            { type: "PRODUCT_GRID", content: { title: "New Arrivals", collectionHandle: "new-arrivals", count: 4 } },
            { type: "TEXT_BLOCK", content: { headline: "Our Design Philosophy", body: "We believe in the beauty of raw materials and the wisdom of traditional craft.", alignment: "center" } }
          ]
        }
      },
      {
        name: "Midnight Royal",
        description: "Deep blacks and gold accents for a premium evening wear experience. High contrast and dramatic typography.",
        previewImage: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800",
        config: {
          theme: {
            primaryColor: "#EAB308", // Golden
            secondaryColor: "#0A0A0A", // Deep Black
            fontHeading: "serif",
            fontBody: "serif",
            buttonRadius: "2rem"
          },
          sections: [
            { 
              type: "HERO", 
              content: { 
                variant: "aesthetic", 
                headline: "Royal Threads.", 
                subheadline: "The Midnight Silk Collection — Limited Edition.",
                ctaText: "Shop the Collection",
                image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800"
              } 
            },
            { type: "DEAL_BANNER", content: { headline: "Exclusive Launch Offer: 20% OFF", subtext: "Use code ROYALTY at checkout", ctaText: "Claim Now", ctaLink: "/collections/silk" } },
            { type: "PRODUCT_GRID", content: { title: "The Silk Edit", collectionHandle: "unstitched", count: 8 } },
            { type: "INSTAGRAM_FEED", content: { headline: "Styled by You", handleText: "@raaghas_midnight" } }
          ]
        }
      },
      {
        name: "Luxury Wine",
        description: "Signature Raaghas colors: Rich wine and ivory. Classic ethnic layouts with mosaic storytelling.",
        previewImage: "https://images.unsplash.com/photo-1610030469983-98e550d615e1?q=80&w=800",
        config: {
          theme: {
            primaryColor: "#701A31",
            secondaryColor: "#F4F1ED",
            fontHeading: "serif",
            fontBody: "sans",
            buttonRadius: "0.5rem"
          },
          sections: [
            { 
              type: "HERO", 
              content: { 
                variant: "holographic_layer", 
                headline: "RAAGHAS", 
                subheadline: "Ancient Arts, Modern Fit.",
                text: "Celebrating the timeless beauty of Indian textiles with a contemporary silhouette."
              } 
            },
            { type: "CATEGORIES_MOSAIC", content: { headline: "Explore our Craft", subheadline: "From Kalamkari to Silk" } },
            { type: "STORY_BANNER", content: { headline: "A Legacy in Every Thread", subtext: "Meet the artisans behind your favorite pieces." } },
            { type: "BRAND_STORY", content: { headline: "The Raaghas Journey", body: "What started as a small dream in Chennai has now become a beacon of traditional luxury.", signatureText: "— Sneha & Priya" } },
            { type: "TESTIMONIAL_SLIDER", content: { headline: "Voices of Raaghas", testimonials: [{ name: "Anjali S.", quote: "The fabric quality is unmatched.", city: "Mumbai" }, { name: "Riya K.", quote: "Absolutely stunning designs.", city: "Delhi" }] } }
          ]
        }
      }
    ];

    for (const preset of flagshipPresets) {
      await this.prisma.themePreset.upsert({
        where: { id: preset.name.toLowerCase().replace(/ /g, '-') },
        update: preset,
        create: { id: preset.name.toLowerCase().replace(/ /g, '-'), ...preset }
      });
    }

    return { success: true, count: flagshipPresets.length };
  }
}
