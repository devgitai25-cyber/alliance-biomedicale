"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PromotionsService = class PromotionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateCode(code, subtotal) {
        const promotion = await this.prisma.promotion.findUnique({
            where: { code: code.toUpperCase() },
        });
        if (!promotion) {
            throw new common_1.NotFoundException('Code promo invalide');
        }
        if (!promotion.active) {
            throw new common_1.BadRequestException('Ce code promo n\'est plus actif');
        }
        const now = new Date();
        if (promotion.startsAt && promotion.startsAt > now) {
            throw new common_1.BadRequestException('Ce code promo n\'est pas encore disponible');
        }
        if (promotion.expiresAt && promotion.expiresAt < now) {
            throw new common_1.BadRequestException('Ce code promo a expiré');
        }
        if (promotion.maxUses && promotion.usedCount >= promotion.maxUses) {
            throw new common_1.BadRequestException('La limite d\'utilisation de ce code a été atteinte');
        }
        if (promotion.minPurchase && subtotal < promotion.minPurchase) {
            throw new common_1.BadRequestException(`Ce code nécessite un achat minimum de ${promotion.minPurchase} TND`);
        }
        let discountAmount = 0;
        if (promotion.type === client_1.DiscountType.PERCENTAGE) {
            discountAmount = (subtotal * promotion.value) / 100;
        }
        else {
            discountAmount = promotion.value;
        }
        return {
            isValid: true,
            id: promotion.id,
            code: promotion.code,
            type: promotion.type,
            value: promotion.value,
            discountAmount: Math.min(discountAmount, subtotal),
        };
    }
    async incrementUsage(id) {
        return this.prisma.promotion.update({
            where: { id },
            data: {
                usedCount: {
                    increment: 1,
                },
            },
        });
    }
    async findAll() {
        return this.prisma.promotion.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.PromotionsService = PromotionsService;
exports.PromotionsService = PromotionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PromotionsService);
//# sourceMappingURL=promotions.service.js.map