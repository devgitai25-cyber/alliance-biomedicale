import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PromotionsService } from '../promotions/promotions.service';
export declare class OrdersService {
    private prisma;
    private promotionsService;
    private readonly logger;
    constructor(prisma: PrismaService, promotionsService: PromotionsService);
    create(createOrderDto: CreateOrderDto): Promise<{
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                sku: string | null;
                description: string;
                shortDescription: string | null;
                ingredients: string | null;
                usage: string | null;
                price: number;
                comparePrice: number | null;
                stock: number;
                images: string[];
                featured: boolean;
                isBundle: boolean;
                tags: string[];
                categoryId: string;
                active: boolean;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            subtotal: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        discount: number;
        shipping: number;
        shippingName: string;
        shippingPhone: string;
        shippingAddress: string;
        shippingCity: string;
        shippingZip: string | null;
        shippingCountry: string | null;
        notes: string | null;
        locale: string;
        userId: string;
        promotionId: string | null;
    }>;
    findAll(): Promise<({
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                sku: string | null;
                description: string;
                shortDescription: string | null;
                ingredients: string | null;
                usage: string | null;
                price: number;
                comparePrice: number | null;
                stock: number;
                images: string[];
                featured: boolean;
                isBundle: boolean;
                tags: string[];
                categoryId: string;
                active: boolean;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            subtotal: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        discount: number;
        shipping: number;
        shippingName: string;
        shippingPhone: string;
        shippingAddress: string;
        shippingCity: string;
        shippingZip: string | null;
        shippingCountry: string | null;
        notes: string | null;
        locale: string;
        userId: string;
        promotionId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                sku: string | null;
                description: string;
                shortDescription: string | null;
                ingredients: string | null;
                usage: string | null;
                price: number;
                comparePrice: number | null;
                stock: number;
                images: string[];
                featured: boolean;
                isBundle: boolean;
                tags: string[];
                categoryId: string;
                active: boolean;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            subtotal: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        discount: number;
        shipping: number;
        shippingName: string;
        shippingPhone: string;
        shippingAddress: string;
        shippingCity: string;
        shippingZip: string | null;
        shippingCountry: string | null;
        notes: string | null;
        locale: string;
        userId: string;
        promotionId: string | null;
    }>;
    findByUser(userId: string): Promise<({
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                sku: string | null;
                description: string;
                shortDescription: string | null;
                ingredients: string | null;
                usage: string | null;
                price: number;
                comparePrice: number | null;
                stock: number;
                images: string[];
                featured: boolean;
                isBundle: boolean;
                tags: string[];
                categoryId: string;
                active: boolean;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            subtotal: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        discount: number;
        shipping: number;
        shippingName: string;
        shippingPhone: string;
        shippingAddress: string;
        shippingCity: string;
        shippingZip: string | null;
        shippingCountry: string | null;
        notes: string | null;
        locale: string;
        userId: string;
        promotionId: string | null;
    })[]>;
    updateStatus(orderId: string, updateDto: {
        status: string;
        notes?: string;
    }): Promise<{
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                sku: string | null;
                description: string;
                shortDescription: string | null;
                ingredients: string | null;
                usage: string | null;
                price: number;
                comparePrice: number | null;
                stock: number;
                images: string[];
                featured: boolean;
                isBundle: boolean;
                tags: string[];
                categoryId: string;
                active: boolean;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            subtotal: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        orderNumber: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        discount: number;
        shipping: number;
        shippingName: string;
        shippingPhone: string;
        shippingAddress: string;
        shippingCity: string;
        shippingZip: string | null;
        shippingCountry: string | null;
        notes: string | null;
        locale: string;
        userId: string;
        promotionId: string | null;
    }>;
}
