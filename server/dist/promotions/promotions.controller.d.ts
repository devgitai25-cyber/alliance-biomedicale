import { PromotionsService } from './promotions.service';
export declare class PromotionsController {
    private readonly promotionsService;
    constructor(promotionsService: PromotionsService);
    validateCode(code: string, subtotal: string): Promise<{
        isValid: boolean;
        id: string;
        code: string;
        type: import(".prisma/client").$Enums.DiscountType;
        value: number;
        discountAmount: number;
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
