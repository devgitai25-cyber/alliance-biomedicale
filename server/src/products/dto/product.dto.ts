import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsArray, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateProductDto {
    @IsString()
    @IsOptional()
    slug?: string;

    @IsString()
    @IsOptional()
    sku?: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsOptional()
    shortDescription?: string;

    @IsString()
    @IsOptional()
    ingredients?: string;

    @IsString()
    @IsOptional()
    usage?: string;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    comparePrice?: number;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    stock: number;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') return [value];
        if (!value) return [];
        return value;
    })
    images?: string[];

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    featured?: boolean;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    isBundle?: boolean;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsString()
    @IsNotEmpty()
    categoryId: string;
}

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    slug?: string;

    @IsString()
    @IsOptional()
    sku?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    shortDescription?: string;

    @IsString()
    @IsOptional()
    ingredients?: string;

    @IsString()
    @IsOptional()
    usage?: string;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    price?: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    comparePrice?: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    stock?: number;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') return [value];
        if (!value) return [];
        return value;
    })
    images?: string[];

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    featured?: boolean;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    isBundle?: boolean;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    active?: boolean;

    @IsString()
    @IsOptional()
    categoryId?: string;
}
