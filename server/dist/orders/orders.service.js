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
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const promotions_service_1 = require("../promotions/promotions.service");
let OrdersService = OrdersService_1 = class OrdersService {
    prisma;
    promotionsService;
    logger = new common_1.Logger(OrdersService_1.name);
    constructor(prisma, promotionsService) {
        this.prisma = prisma;
        this.promotionsService = promotionsService;
    }
    async create(createOrderDto) {
        const { items, total, email, firstName, lastName, phone, address, city, postalCode, promoCode } = createOrderDto;
        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        this.logger.log(`Creating order ${orderNumber} for ${email}`);
        return this.prisma.$transaction(async (tx) => {
            try {
                const productIds = items.map(item => item.productId);
                const products = await tx.product.findMany({
                    where: {
                        id: { in: productIds },
                        active: true,
                    },
                });
                if (products.length !== productIds.length) {
                    const foundIds = products.map(p => p.id);
                    const missingIds = productIds.filter(id => !foundIds.includes(id));
                    this.logger.warn(`Order ${orderNumber}: Missing or inactive products: ${missingIds.join(', ')}`);
                    throw new common_1.BadRequestException(`Some products are no longer available: ${missingIds.join(', ')}`);
                }
                for (const item of items) {
                    const product = products.find(p => p.id === item.productId);
                    if (!product) {
                        throw new common_1.BadRequestException(`Product ${item.productId} not found`);
                    }
                    if (product.stock < item.quantity) {
                        this.logger.warn(`Order ${orderNumber}: Insufficient stock for product ${product.id}. ` +
                            `Requested: ${item.quantity}, Available: ${product.stock}`);
                        throw new common_1.BadRequestException(`Insufficient stock for product. Available: ${product.stock}, Requested: ${item.quantity}`);
                    }
                }
                let user = await tx.user.findUnique({ where: { email } });
                if (!user) {
                    this.logger.log(`Creating new user for ${email}`);
                    user = await tx.user.create({
                        data: {
                            email,
                            firstName,
                            lastName,
                            phone,
                            password: '$2a$10$GuestUserPasswordPlaceholderHash...',
                        },
                    });
                }
                const rawSubtotal = items.reduce((sum, item) => {
                    const product = products.find(p => p.id === item.productId);
                    return sum + (Number(product.price) * item.quantity);
                }, 0);
                const subtotal = Math.round((rawSubtotal + Number.EPSILON) * 100) / 100;
                let discountAmount = 0;
                let promotionId = undefined;
                if (promoCode) {
                    try {
                        const promo = await this.promotionsService.validateCode(promoCode, subtotal);
                        discountAmount = promo.discountAmount;
                        promotionId = promo.id;
                        await tx.promotion.update({
                            where: { id: promotionId },
                            data: { usedCount: { increment: 1 } },
                        });
                        this.logger.log(`Order ${orderNumber}: Applied promo code ${promoCode}, discount: ${discountAmount}`);
                    }
                    catch (error) {
                        this.logger.warn(`Order ${orderNumber}: Failed to apply promo code ${promoCode}: ${error.message}`);
                        throw error;
                    }
                }
                const shippingCost = subtotal > 100 ? 0 : 7;
                const finalTotal = Math.round((subtotal + shippingCost - discountAmount + Number.EPSILON) * 100) / 100;
                if (Math.abs(finalTotal - total) > 0.01) {
                    this.logger.warn(`Order ${orderNumber}: Total mismatch. ` +
                        `Calculated: ${finalTotal} (Sub: ${subtotal}, Ship: ${shippingCost}, Disc: ${discountAmount}), Received: ${total}`);
                    throw new common_1.BadRequestException(`Order total mismatch. Server: ${finalTotal} (Sub: ${subtotal}, Ship: ${shippingCost}, Disc: ${discountAmount}), Client: ${total}`);
                }
                const order = await tx.order.create({
                    data: {
                        orderNumber,
                        userId: user.id,
                        status: 'PENDING',
                        subtotal,
                        discount: discountAmount,
                        total: finalTotal,
                        promotionId,
                        shippingName: `${firstName} ${lastName}`,
                        shippingPhone: phone,
                        shippingAddress: address,
                        shippingCity: city,
                        shippingZip: postalCode,
                        shippingCountry: createOrderDto.country,
                        items: {
                            create: items.map((item) => {
                                const product = products.find(p => p.id === item.productId);
                                return {
                                    productId: item.productId,
                                    quantity: item.quantity,
                                    price: Number(product.price),
                                    subtotal: Number(product.price) * item.quantity,
                                };
                            }),
                        },
                    },
                    include: {
                        items: {
                            include: {
                                product: true,
                            },
                        },
                    },
                });
                for (const item of items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                decrement: item.quantity,
                            },
                        },
                    });
                }
                this.logger.log(`Order ${orderNumber} created successfully. Total: ${finalTotal}`);
                return order;
            }
            catch (error) {
                this.logger.error(`Failed to create order ${orderNumber}: ${error.message}`, error.stack);
                throw error;
            }
        });
    }
    async findAll() {
        return this.prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
    async findOne(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async findByUser(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
    async updateStatus(orderId, updateDto) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId }
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order ${orderId} not found`);
        }
        const validTransitions = {
            'PENDING': ['PROCESSING', 'PAID', 'CANCELLED'],
            'PROCESSING': ['SHIPPED', 'PAID', 'CANCELLED'],
            'SHIPPED': ['DELIVERED', 'PAID', 'CANCELLED'],
            'DELIVERED': ['PAID', 'CANCELLED'],
            'PAID': ['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
            'CANCELLED': []
        };
        const allowedStatuses = validTransitions[order.status] || [];
        if (!allowedStatuses.includes(updateDto.status)) {
            throw new common_1.BadRequestException(`Cannot transition from ${order.status} to ${updateDto.status}. Allowed transitions: ${allowedStatuses.join(', ') || 'none'}`);
        }
        this.logger.log(`Updating order ${order.orderNumber} status from ${order.status} to ${updateDto.status}`);
        return this.prisma.order.update({
            where: { id: orderId },
            data: {
                status: updateDto.status,
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        promotions_service_1.PromotionsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map