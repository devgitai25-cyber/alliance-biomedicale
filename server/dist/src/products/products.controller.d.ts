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
        description: string;
        comparePrice: number | null;
        sku: string | null;
        shortDescription: string | null;
        ingredients: string | null;
        usage: string | null;
        price: number;
        stock: number;
        images: string[];
        featured: boolean;
        isBundle: boolean;
        tags: string[];
        active: boolean;
        categoryId: string;
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
        description: string;
        comparePrice: number | null;
        sku: string | null;
        shortDescription: string | null;
        ingredients: string | null;
        usage: string | null;
        price: number;
        stock: number;
        images: string[];
        featured: boolean;
        isBundle: boolean;
        tags: string[];
        active: boolean;
        categoryId: string;
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
        description: string;
        comparePrice: number | null;
        sku: string | null;
        shortDescription: string | null;
        ingredients: string | null;
        usage: string | null;
        price: number;
        stock: number;
        images: string[];
        featured: boolean;
        isBundle: boolean;
        tags: string[];
        active: boolean;
        categoryId: string;
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
        description: string;
        comparePrice: number | null;
        sku: string | null;
        shortDescription: string | null;
        ingredients: string | null;
        usage: string | null;
        price: number;
        stock: number;
        images: string[];
        featured: boolean;
        isBundle: boolean;
        tags: string[];
        active: boolean;
        categoryId: string;
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
        description: string;
        comparePrice: number | null;
        sku: string | null;
        shortDescription: string | null;
        ingredients: string | null;
        usage: string | null;
        price: number;
        stock: number;
        images: string[];
        featured: boolean;
        isBundle: boolean;
        tags: string[];
        active: boolean;
        categoryId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string;
        comparePrice: number | null;
        sku: string | null;
        shortDescription: string | null;
        ingredients: string | null;
        usage: string | null;
        price: number;
        stock: number;
        images: string[];
        featured: boolean;
        isBundle: boolean;
        tags: string[];
        active: boolean;
        categoryId: string;
    }>;
}
