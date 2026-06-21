import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('navigation')
export class NavigationController {
  constructor(private prisma: PrismaService) {}

  private readonly menus: Record<string, any> = {
    'header-main': {
      items: [
        { id: '1', label: 'Collections', url: '/collections', children: [] },
        { id: '2', label: 'Our Story', url: '/about' },
        { id: '3', label: 'Wholesale', url: '/wholesale/register' },
      ],
    },
    'footer-shop': {
      items: [
        { id: 'f1', label: 'All Products', url: '/collections/all' },
        { id: 'f2', label: 'New Arrivals', url: '/collections/new-arrivals' },
        { id: 'f3', label: 'Accessories', url: '/collections/accessories' },
      ],
    },
    'footer-help': {
      items: [
        { id: 'h1', label: 'Contact Us', url: '/support' },
        { id: 'h2', label: 'Shipping Policy', url: '/shipping' },
        { id: 'h3', label: 'Track Order', url: '/orders/track' },
      ],
    },
    'footer-brand': {
      items: [
        { id: 'b1', label: 'Terms of Service', url: '/terms' },
        { id: 'b2', label: 'Privacy Policy', url: '/privacy' },
      ],
    },
  };

  @Get(':handle')
  async getNavigation(@Param('handle') handle: string) {
    const menu = JSON.parse(JSON.stringify(this.menus[handle] || null));
    if (!menu) {
      throw new NotFoundException(`Menu with handle ${handle} not found`);
    }

    if (handle === 'header-main') {
      const collectionsItem = menu.items.find((item: any) => item.label === 'Collections');
      if (collectionsItem) {
        const collections = await this.prisma.collection.findMany({
          select: { id: true, title: true, handle: true },
          take: 10
        });
        collectionsItem.children = collections.map((col, index) => ({
          id: `col-${index}`,
          label: col.title,
          url: `/collections/${col.handle}`
        }));
      }
    }

    return menu;
  }
}
