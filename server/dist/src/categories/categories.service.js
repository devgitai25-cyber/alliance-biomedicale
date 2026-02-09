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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async findOne(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async create(createCategoryDto) {
        const existing = await this.prisma.category.findUnique({
            where: { slug: createCategoryDto.slug },
        });
        if (existing) {
            throw new common_1.ConflictException(`Category with slug '${createCategoryDto.slug}' already exists`);
        }
        return this.prisma.category.create({
            data: {
                ...createCategoryDto,
                displayOrder: createCategoryDto.displayOrder ?? 0,
            },
        });
    }
    async update(id, updateCategoryDto) {
        await this.findOne(id);
        if (updateCategoryDto.slug) {
            const existing = await this.prisma.category.findUnique({
                where: { slug: updateCategoryDto.slug },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException(`Category with slug '${updateCategoryDto.slug}' already exists`);
            }
        }
        return this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
        });
    }
    async remove(id) {
        const category = await this.findOne(id);
        const productCount = await this.prisma.product.count({
            where: { categoryId: id },
        });
        if (productCount > 0) {
            throw new common_1.ConflictException(`Cannot delete category with ${productCount} product(s). Please reassign or delete products first.`);
        }
        await this.prisma.category.delete({
            where: { id },
        });
        return { message: 'Category deleted successfully' };
    }
    async reorder(items) {
        await this.prisma.$transaction(items.map((item) => this.prisma.category.update({
            where: { id: item.id },
            data: { displayOrder: item.displayOrder },
        })));
        return { message: 'Categories reordered successfully' };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map