import { PrismaService } from '../prisma/prisma.service';
export declare class WishlistService {
    private prisma;
    constructor(prisma: PrismaService);
    getWishlist(userId: string): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            image: string | null;
            displayOrder: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string;
        comparePrice: number | null;
        sku: string | null;
        shortDescription: string | null;
        ingredients: string | null;
        usage: string | null;
        price: number;
        stock: number;
        images: string[];
        featured: boolean;
        isBundle: boolean;
        tags: string[];
        active: boolean;
        categoryId: string;
    })[]>;
    addToWishlist(userId: string, productId: string): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        userId: string;
    }>;
    removeFromWishlist(userId: string, productId: string): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        userId: string;
    }>;
    checkInWishlist(userId: string, productId: string): Promise<boolean>;
}
