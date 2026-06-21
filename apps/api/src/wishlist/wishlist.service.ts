import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  private readonly logger = new Logger(WishlistService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getUserWishlist(userId: string) {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
    
    // The frontend useWishlist hook expects an array of objects where object.id is the product ID.
    // We return an array of modified product objects that represent the wishlist items.
    return items.map((item) => ({
      ...item.product,
      wishlistItemId: item.id,
      addedAt: item.createdAt,
    }));
  }

  async add(userId: string, productId: string) {
    try {
      const existing = await this.prisma.wishlistItem.findUnique({
        where: {
          userId_productId: { userId, productId },
        },
      });

      if (!existing) {
        await this.prisma.wishlistItem.create({
          data: { userId, productId },
        });
      }
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to add product ${productId} to wishlist for user ${userId}`, error);
      return { success: false, error: 'Failed to add to wishlist' };
    }
  }

  async remove(userId: string, productId: string) {
    try {
      await this.prisma.wishlistItem.deleteMany({
        where: { userId, productId },
      });
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to remove product ${productId} from wishlist for user ${userId}`, error);
      return { success: false, error: 'Failed to remove from wishlist' };
    }
  }

  async syncWishlist(userId: string, productIds: string[]) {
    try {
      if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return { success: true };
      }

      // Add all missing items
      const existing = await this.prisma.wishlistItem.findMany({
        where: { userId, productId: { in: productIds } },
      });
      
      const existingIds = new Set(existing.map((item) => item.productId));
      const toAdd = productIds.filter((id) => !existingIds.has(id));

      if (toAdd.length > 0) {
        await this.prisma.wishlistItem.createMany({
          data: toAdd.map((productId) => ({ userId, productId })),
          skipDuplicates: true,
        });
      }
      
      return { success: true, added: toAdd.length };
    } catch (error) {
      this.logger.error(`Failed to sync wishlist for user ${userId}`, error);
      return { success: false, error: 'Failed to sync wishlist' };
    }
  }
}
