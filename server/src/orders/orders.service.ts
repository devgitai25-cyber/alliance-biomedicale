import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PromotionsService } from '../promotions/promotions.service';

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);

    constructor(
        private prisma: PrismaService,
        private promotionsService: PromotionsService
    ) { }

    async create(createOrderDto: CreateOrderDto) {
        const { items, total, email, firstName, lastName, phone, address, city, postalCode, promoCode } = createOrderDto;

        // Generate Order Number
        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        this.logger.log(`Creating order ${orderNumber} for ${email}`);

        return this.prisma.$transaction(async (tx) => {
            try {
                // 1. Validate all products exist and are active
                const productIds = items.map(item => item.productId);
                const products = await tx.product.findMany({
                    where: {
                        id: { in: productIds },
                        active: true, // Only allow ordering active products
                    },
                });

                if (products.length !== productIds.length) {
                    const foundIds = products.map(p => p.id);
                    const missingIds = productIds.filter(id => !foundIds.includes(id));
                    this.logger.warn(`Order ${orderNumber}: Missing or inactive products: ${missingIds.join(', ')}`);
                    throw new BadRequestException(
                        `Some products are no longer available: ${missingIds.join(', ')}`
                    );
                }

                // 2. Validate stock availability for all items
                for (const item of items) {
                    const product = products.find(p => p.id === item.productId);
                    if (!product) {
                        throw new BadRequestException(`Product ${item.productId} not found`);
                    }
                    if (product.stock < item.quantity) {
                        this.logger.warn(
                            `Order ${orderNumber}: Insufficient stock for product ${product.id}. ` +
                            `Requested: ${item.quantity}, Available: ${product.stock}`
                        );
                        throw new BadRequestException(
                            `Insufficient stock for product. Available: ${product.stock}, Requested: ${item.quantity}`
                        );
                    }
                }

                // 3. Find or create user
                let user = await tx.user.findUnique({ where: { email } });
                if (!user) {
                    this.logger.log(`Creating new user for ${email}`);
                    // Create checkout user (password placeholder for guest checkout)
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

                // 4. Calculate subtotal from actual product prices (security: don't trust client)
                const rawSubtotal = items.reduce((sum, item) => {
                    const product = products.find(p => p.id === item.productId);
                    return sum + (Number(product!.price) * item.quantity);
                }, 0);
                const subtotal = Math.round((rawSubtotal + Number.EPSILON) * 100) / 100;

                let discountAmount = 0;
                let promotionId: string | undefined = undefined;

                // 5. Handle Promo Code if provided
                if (promoCode) {
                    try {
                        const promo = await this.promotionsService.validateCode(promoCode, subtotal);
                        discountAmount = promo.discountAmount;
                        promotionId = promo.id;

                        // Increment usage counter
                        await tx.promotion.update({
                            where: { id: promotionId },
                            data: { usedCount: { increment: 1 } },
                        });
                        this.logger.log(`Order ${orderNumber}: Applied promo code ${promoCode}, discount: ${discountAmount}`);
                    } catch (error) {
                        this.logger.warn(`Order ${orderNumber}: Failed to apply promo code ${promoCode}: ${error.message}`);
                        // Don't fail the order if promo code is invalid, just skip it
                        // Alternatively, you could rethrow to make it required
                        throw error; // Uncomment to make promo code validation strict
                    }
                }

                // Shipping Calculation (Matches Frontend Logic)
                const shippingCost = subtotal > 100 ? 0 : 7;
                const finalTotal = Math.round((subtotal + shippingCost - discountAmount + Number.EPSILON) * 100) / 100;

                // 6. Validate total matches (prevent price manipulation)
                if (Math.abs(finalTotal - total) > 0.01) {
                    this.logger.warn(
                        `Order ${orderNumber}: Total mismatch. ` +
                        `Calculated: ${finalTotal} (Sub: ${subtotal}, Ship: ${shippingCost}, Disc: ${discountAmount}), Received: ${total}`
                    );
                    throw new BadRequestException(
                        `Order total mismatch. Server: ${finalTotal} (Sub: ${subtotal}, Ship: ${shippingCost}, Disc: ${discountAmount}), Client: ${total}`
                    );
                }

                // 7. Create Order
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
                                const product = products.find(p => p.id === item.productId)!;
                                return {
                                    productId: item.productId,
                                    quantity: item.quantity,
                                    price: Number(product.price), // Use actual price from DB
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

                // 8. Update stock for all products
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

            } catch (error) {
                this.logger.error(`Failed to create order ${orderNumber}: ${error.message}`, error.stack);
                throw error; // Transaction will auto-rollback
            }
        });
    }

    async findAll() {
        return this.prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }

    async findOne(id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                    },
                },
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }

        return order;
    }

    async findByUser(userId: string) {
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

    async updateStatus(orderId: string, updateDto: { status: string; notes?: string }) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            throw new NotFoundException(`Order ${orderId} not found`);
        }

        // Validate status transitions
        // Allow more flexible transitions for COD workflow
        const validTransitions: Record<string, string[]> = {
            'PENDING': ['PROCESSING', 'PAID', 'CANCELLED'],     // Can go to processing (confirmed) or paid (if money received early)
            'PROCESSING': ['SHIPPED', 'PAID', 'CANCELLED'],     // Can ship or mark paid
            'SHIPPED': ['DELIVERED', 'PAID', 'CANCELLED'],      // Can deliver or mark paid
            'DELIVERED': ['PAID', 'CANCELLED'],                 // Can mark paid after delivery (typical COD)
            'PAID': ['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], // If paid early, can continue workflow
            'CANCELLED': []
        };

        const allowedStatuses = validTransitions[order.status] || [];
        if (!allowedStatuses.includes(updateDto.status)) {
            throw new BadRequestException(
                `Cannot transition from ${order.status} to ${updateDto.status}. Allowed transitions: ${allowedStatuses.join(', ') || 'none'}`
            );
        }

        this.logger.log(`Updating order ${order.orderNumber} status from ${order.status} to ${updateDto.status}`);

        // If cancelling, restore stock
        if (updateDto.status === 'CANCELLED' && order.status !== 'CANCELLED') {
            await this.prisma.$transaction(async (tx) => {
                // 1. Update order status
                await tx.order.update({
                    where: { id: orderId },
                    data: { status: 'CANCELLED' },
                });

                // 2. Restore stock
                const orderWithItems = await tx.order.findUnique({
                    where: { id: orderId },
                    include: { items: true },
                });

                if (orderWithItems) {
                    for (const item of orderWithItems.items) {
                        await tx.product.update({
                            where: { id: item.productId },
                            data: {
                                stock: { increment: item.quantity },
                            },
                        });
                    }
                }
            });

            return this.findOne(orderId);
        }

        return this.prisma.order.update({
            where: { id: orderId },
            data: {
                status: updateDto.status as any,
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
}
