import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
    constructor(private prisma: PrismaService) { }

    async getWishlist(userId: string) {
        const wishlistItems = await this.prisma.wishlist.findMany({
            where: { userId },
            include: {
                product: {
                    include: {
                        category: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Filter and map to flatten the structure if needed, or just return products
        return wishlistItems
            .filter(item => item.product && item.product.active)
            .map((item) => item.product);
    }

    async addToWishlist(userId: string, productId: string) {
        // Validate product exists and is active
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        if (!product.active) {
            throw new ConflictException('This product is no longer available');
        }

        // Check if already exists
        const existing = await this.prisma.wishlist.findUnique({
            where: {
                userId_productId: { userId, productId },
            },
        });

        if (existing) {
            // Return success if already in wishlist (idempotent)
            return existing;
        }

        return this.prisma.wishlist.create({
            data: {
                userId,
                productId,
            },
        });
    }

    async removeFromWishlist(userId: string, productId: string) {
        try {
            return await this.prisma.wishlist.delete({
                where: {
                    userId_productId: { userId, productId },
                },
            });
        } catch (error) {
            throw new NotFoundException('Item not found in wishlist');
        }
    }

    async checkInWishlist(userId: string, productId: string) {
        const item = await this.prisma.wishlist.findUnique({
            where: {
                userId_productId: { userId, productId },
            },
        });
        return !!item;
    }
}
