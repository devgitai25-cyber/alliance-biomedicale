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
            // Check if any products in this category have associated orders
            // We cannot delete products that have been ordered (integrity)
            const productsWithOrders = await this.prisma.product.count({
                where: {
                    categoryId: id,
                    orderItems: {
                        some: {},
                    },
                },
            });

            if (productsWithOrders > 0) {
                throw new ConflictException(
                    `Cannot delete category. ${productsWithOrders} product(s) have existing orders and cannot be removed.`,
                );
            }
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
