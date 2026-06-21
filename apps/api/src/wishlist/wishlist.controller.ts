import { Controller, Get, Post, Delete, Param, Req, Body, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('wishlist')
@UseGuards(AuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async getWishlist(@Req() req: any) {
    const userId = req.user?.sub || req.user?.id;
    if (!userId) {
      return [];
    }
    return this.wishlistService.getUserWishlist(userId);
  }

  @Post('sync')
  async syncWishlist(@Req() req: any, @Body() body: { productIds: string[] }) {
    const userId = req.user?.sub || req.user?.id;
    if (!userId || !body.productIds) {
      return { success: false, message: 'Authentication required' };
    }
    return this.wishlistService.syncWishlist(userId, body.productIds);
  }

  @Post(':productId')
  async addToWishlist(@Req() req: any, @Param('productId') productId: string) {
    const userId = req.user?.sub || req.user?.id;
    if (!userId) {
      return { success: false, message: 'Authentication required' };
    }
    return this.wishlistService.add(userId, productId);
  }

  @Delete(':productId')
  async removeFromWishlist(@Req() req: any, @Param('productId') productId: string) {
    const userId = req.user?.sub || req.user?.id;
    if (!userId) {
      return { success: false, message: 'Authentication required' };
    }
    return this.wishlistService.remove(userId, productId);
  }
}
