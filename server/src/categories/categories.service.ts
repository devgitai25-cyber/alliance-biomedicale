import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.category.findMany({
            orderBy: { displayOrder: 'asc' },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
    }

    async findOne(id: string) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return category;
    }

    async create(createCategoryDto: CreateCategoryDto) {
        // Check if slug already exists
        const existing = await this.prisma.category.findUnique({
            where: { slug: createCategoryDto.slug },
        });

        if (existing) {
            throw new ConflictException(
                `Category with slug '${createCategoryDto.slug}' already exists`,
            );
        }

        return this.prisma.category.create({
            data: {
                ...createCategoryDto,
                displayOrder: createCategoryDto.displayOrder ?? 0,
            },
        });
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        // Check if category exists
        await this.findOne(id);

        // If slug is being updated, check it doesn't conflict
        if (updateCategoryDto.slug) {
            const existing = await this.prisma.category.findUnique({
                where: { slug: updateCategoryDto.slug },
            });

            if (existing && existing.id !== id) {
                throw new ConflictException(
                    `Category with slug '${updateCategoryDto.slug}' already exists`,
                );
            }
        }

        return this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
        });
    }

    async remove(id: string, cascade: boolean = false) {
        const category = await this.findOne(id);

        if (!cascade) {
            // Check if category has products
            const productCount = await this.prisma.product.count({
                where: { categoryId: id },
            });

            if (productCount > 0) {
                throw new ConflictException(
                    `Cannot delete category with ${productCount} product(s). Please reassign or delete products first.`,
                );
            }
        } else {
            // Get all product IDs in this category
            const products = await this.prisma.product.findMany({
                where: { categoryId: id },
                select: { id: true },
            });
            const productIds = products.map((p) => p.id);

            // Check for active (non-cancelled) orders containing these products
            const activeOrders = await this.prisma.order.findMany({
                where: {
                    items: {
                        some: {
                            productId: { in: productIds },
                        },
                    },
                    status: { not: 'CANCELLED' },
                },
                select: { orderNumber: true },
            });

            if (activeOrders.length > 0) {
                const orderNumbers = activeOrders.map((o) => o.orderNumber).join(', ');
                throw new ConflictException(
                    `Deletion blocked by active Orders: ${orderNumbers}. Please cancel these orders first.`,
                );
            }

            // Clean up OrderItems from CANCELLED orders to satisfy foreign key constraints
            await this.prisma.orderItem.deleteMany({
                where: {
                    productId: { in: productIds },
                    order: { status: 'CANCELLED' },
                },
            });
        }

        await this.prisma.category.delete({
            where: { id },
        });

        return { message: 'Category deleted successfully' };
    }

    async reorder(items: { id: string; displayOrder: number }[]) {
        // Update display order for all items in a transaction
        await this.prisma.$transaction(
            items.map((item) =>
                this.prisma.category.update({
                    where: { id: item.id },
                    data: { displayOrder: item.displayOrder },
                }),
            ),
        );

        return { message: 'Categories reordered successfully' };
    }
}
