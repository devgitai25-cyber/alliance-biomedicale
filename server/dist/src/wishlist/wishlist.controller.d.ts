import { WishlistService } from './wishlist.service';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    getWishlist(req: any): Promise<({
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
    addToWishlist(req: any, productId: string): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        userId: string;
    }>;
    removeFromWishlist(req: any, productId: string): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        userId: string;
    }>;
    checkInWishlist(req: any, productId: string): Promise<{
        isInWishlist: boolean;
    }>;
}
