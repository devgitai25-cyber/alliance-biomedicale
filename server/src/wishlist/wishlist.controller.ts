import { Controller, Get, Post, Delete, Param, Query, UseGuards, Request } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) { }

    @Get()
    async getWishlist(@Request() req) {
        return this.wishlistService.getWishlist(req.user.id);
    }

    @Post(':productId')
    async addToWishlist(@Request() req, @Param('productId') productId: string) {
        return this.wishlistService.addToWishlist(req.user.id, productId);
    }

    @Delete(':productId')
    async removeFromWishlist(@Request() req, @Param('productId') productId: string) {
        return this.wishlistService.removeFromWishlist(req.user.id, productId);
    }

    @Get('check/:productId')
    async checkInWishlist(@Request() req, @Param('productId') productId: string) {
        const isInWishlist = await this.wishlistService.checkInWishlist(req.user.id, productId);
        return { isInWishlist };
    }
}

