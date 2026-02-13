import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
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
    findMyOrders(req: any): Promise<({
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
    updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto): Promise<{
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
}
