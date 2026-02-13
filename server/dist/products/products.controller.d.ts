import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { UploadService } from '../upload/upload.service';
export declare class ProductsController {
    private readonly productsService;
    private readonly uploadService;
    constructor(productsService: ProductsService, uploadService: UploadService);
    create(createProductDto: CreateProductDto, file: Express.Multer.File): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            image: string | null;
            displayOrder: number;
        };
    } & {
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
    }>;
    findAllCategories(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
        image: string | null;
        displayOrder: number;
    }[]>;
    findAll(categoryId?: string, featured?: string): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            image: string | null;
            displayOrder: number;
        };
    } & {
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
    })[]>;
    findBySlug(slug: string): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            image: string | null;
            displayOrder: number;
        };
    } & {
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
    }>;
    findOne(id: string): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            image: string | null;
            displayOrder: number;
        };
    } & {
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
    }>;
    update(id: string, updateProductDto: UpdateProductDto, file: Express.Multer.File): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            image: string | null;
            displayOrder: number;
        };
    } & {
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
