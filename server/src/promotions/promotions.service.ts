import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DiscountType } from '@prisma/client';

@Injectable()
export class PromotionsService {
    constructor(private prisma: PrismaService) { }

    async validateCode(code: string, subtotal: number) {
        const promotion = await this.prisma.promotion.findUnique({
            where: { code: code.toUpperCase() },
        });

        if (!promotion) {
            throw new NotFoundException('Code promo invalide');
        }

        if (!promotion.active) {
            throw new BadRequestException('Ce code promo n\'est plus actif');
        }

        const now = new Date();
        if (promotion.startsAt && promotion.startsAt > now) {
            throw new BadRequestException('Ce code promo n\'est pas encore disponible');
        }

        if (promotion.expiresAt && promotion.expiresAt < now) {
            throw new BadRequestException('Ce code promo a expiré');
        }

        if (promotion.maxUses && promotion.usedCount >= promotion.maxUses) {
            throw new BadRequestException('La limite d\'utilisation de ce code a été atteinte');
        }

        if (promotion.minPurchase && subtotal < promotion.minPurchase) {
            throw new BadRequestException(`Ce code nécessite un achat minimum de ${promotion.minPurchase} TND`);
        }

        // Calculate discount amount for preview
        let discountAmount = 0;
        if (promotion.type === DiscountType.PERCENTAGE) {
            discountAmount = (subtotal * promotion.value) / 100;
        } else {
            discountAmount = promotion.value;
        }

        return {
            isValid: true,
            id: promotion.id,
            code: promotion.code,
            type: promotion.type,
            value: promotion.value,
            discountAmount: Math.min(discountAmount, subtotal), // Cannot discount more than total
        };
    }

    async incrementUsage(id: string) {
        return this.prisma.promotion.update({
            where: { id },
            data: {
                usedCount: {
                    increment: 1,
                },
            },
        });
    }

    // Admin methods could go here
    async findAll() {
        return this.prisma.promotion.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
}
