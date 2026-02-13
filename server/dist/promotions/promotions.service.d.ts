import { PrismaService } from '../prisma/prisma.service';
export declare class PromotionsService {
    private prisma;
    constructor(prisma: PrismaService);
    validateCode(code: string, subtotal: number): Promise<{
        isValid: boolean;
        id: string;
        code: string;
        type: import(".prisma/client").$Enums.DiscountType;
        value: number;
        discountAmount: number;
    }>;
    incrementUsage(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: number;
        active: boolean;
        code: string;
        type: import(".prisma/client").$Enums.DiscountType;
        minPurchase: number | null;
        maxUses: number | null;
        usedCount: number;
        startsAt: Date | null;
        expiresAt: Date | null;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: number;
        active: boolean;
        code: string;
        type: import(".prisma/client").$Enums.DiscountType;
        minPurchase: number | null;
        maxUses: number | null;
        usedCount: number;
        startsAt: Date | null;
        expiresAt: Date | null;
    }[]>;
}
