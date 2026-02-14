import { IsString, IsNotEmpty, IsOptional, Matches, MinLength, MaxLength, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-z0-9-]+$/, {
        message: 'Slug must contain only lowercase letters, numbers, and hyphens',
    })
    slug: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    displayOrder?: number;
}

