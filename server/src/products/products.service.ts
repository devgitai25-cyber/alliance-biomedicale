import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async create(createProductDto: CreateProductDto) {
        // Auto-generate slug if missing
        let slug = createProductDto.slug;
        if (!slug) {
            slug = createProductDto.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
        }

        // Ensure slug uniqueness
        slug = await this.generateUniqueSlug(slug);

        const product = await this.prisma.product.create({
            data: {
                ...createProductDto,
                slug,
            },
            include: {
                category: true,
            },
        });

        return product;
    }

    private async generateUniqueSlug(baseSlug: string): Promise<string> {
        let slug = baseSlug;
        let counter = 1;

        while (true) {
            const existingProduct = await this.prisma.product.findUnique({
                where: { slug },
            });

            if (!existingProduct) {
                return slug;
            }

            slug = `${baseSlug}-${counter}`;
            counter++;
        }
    }

    async findAllCategories() {
        return this.prisma.category.findMany({
            orderBy: { displayOrder: 'asc' },
        });
    }

    async findAll(categoryId?: string, featured?: boolean) {
        return this.prisma.product.findMany({
            where: {
                active: true,
                ...(categoryId && { categoryId }),
                ...(featured !== undefined && { featured }),
            },
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async findBySlug(slug: string) {
        const product = await this.prisma.product.findFirst({
            where: {
                slug,
                active: true,
            },
            include: {
                category: true,
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
            include: {
                category: true,
            },
        });
    }

    async remove(id: string) {
        // Soft delete
        return this.prisma.product.update({
            where: { id },
            data: { active: false },
        });
    }

    async updateStock(id: string, quantity: number) {
        return this.prisma.product.update({
            where: { id },
            data: {
                stock: {
                    decrement: quantity,
                },
            },
        });
    }
}
