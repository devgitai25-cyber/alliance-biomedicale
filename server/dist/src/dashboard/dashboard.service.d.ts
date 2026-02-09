import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        productsCount: number;
        ordersCount: number;
        usersCount: number;
        totalRevenue: number;
        recentOrders: ({
            user: {
                email: string;
                firstName: string | null;
                lastName: string | null;
            };
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
        })[];
    }>;
}
