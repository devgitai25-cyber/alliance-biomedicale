
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getStats() {
        const [
            productsCount,
            ordersCount,
            usersCount,
            totalRevenue,
            recentOrders
        ] = await Promise.all([
            this.prisma.product.count({ where: { active: true } }),
            this.prisma.order.count(),
            this.prisma.user.count({
                where: { isAdmin: false }
            }),
            this.prisma.order.aggregate({
                _sum: {
                    total: true
                }
            }),
            this.prisma.order.findMany({
                take: 5,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                }
            })
        ]);

        return {
            productsCount,
            ordersCount,
            usersCount,
            totalRevenue: totalRevenue._sum.total || 0,
            recentOrders
        };
    }
}
