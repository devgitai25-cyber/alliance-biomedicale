export declare class CreateProductDto {
    slug?: string;
    sku?: string;
    name: string;
    description: string;
    shortDescription?: string;
    ingredients?: string;
    usage?: string;
    price: number;
    comparePrice?: number;
    stock: number;
    images?: string[];
    featured?: boolean;
    isBundle?: boolean;
    tags?: string[];
    categoryId: string;
}
export declare class UpdateProductDto {
    slug?: string;
    sku?: string;
    name?: string;
    description?: string;
    shortDescription?: string;
    ingredients?: string;
    usage?: string;
    price?: number;
    comparePrice?: number;
    stock?: number;
    images?: string[];
    featured?: boolean;
    isBundle?: boolean;
    tags?: string[];
    active?: boolean;
    categoryId?: string;
}
