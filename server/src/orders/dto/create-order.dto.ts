import {
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
    Min,
    Max,
    MinLength,
    MaxLength,
    Matches,
    ArrayMinSize
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
    @IsString()
    @IsNotEmpty({ message: 'Product ID is required' })
    productId: string;

    @IsNumber({}, { message: 'Quantity must be a number' })
    @Min(1, { message: 'Quantity must be at least 1' })
    @Max(100, { message: 'Quantity cannot exceed 100' })
    quantity: number;

    @IsNumber({}, { message: 'Price must be a number' })
    @Min(0, { message: 'Price must be positive' })
    price: number;
}

export class CreateOrderDto {
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'First name is required' })
    @MinLength(2, { message: 'First name must be at least 2 characters' })
    @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
    firstName: string;

    @IsString()
    @IsNotEmpty({ message: 'Last name is required' })
    @MinLength(2, { message: 'Last name must be at least 2 characters' })
    @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
    lastName: string;

    @IsString()
    @IsNotEmpty({ message: 'Phone number is required' })
    @Matches(/^[\d\s\+\-\(\)]+$/, { message: 'Please provide a valid phone number' })
    @MinLength(8, { message: 'Phone number must be at least 8 characters' })
    @MaxLength(20, { message: 'Phone number cannot exceed 20 characters' })
    phone: string;

    @IsString()
    @IsNotEmpty({ message: 'Address is required' })
    @MinLength(5, { message: 'Address must be at least 5 characters' })
    @MaxLength(200, { message: 'Address cannot exceed 200 characters' })
    address: string;

    @IsString()
    @IsNotEmpty({ message: 'City is required' })
    @MinLength(2, { message: 'City must be at least 2 characters' })
    @MaxLength(100, { message: 'City cannot exceed 100 characters' })
    city: string;

    @IsString()
    @IsNotEmpty({ message: 'Postal code is required' })
    @MinLength(4, { message: 'Postal code must be at least 4 characters' })
    @MaxLength(10, { message: 'Postal code cannot exceed 10 characters' })
    postalCode: string;

    @IsString()
    @IsNotEmpty({ message: 'Country is required' })
    @MinLength(2, { message: 'Country must be at least 2 characters' })
    @MaxLength(100, { message: 'Country cannot exceed 100 characters' })
    country: string;

    @IsArray({ message: 'Items must be an array' })
    @ArrayMinSize(1, { message: 'Order must contain at least one item' })
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @IsNumber({}, { message: 'Total must be a number' })
    @Min(0, { message: 'Total must be positive' })
    total: number;

    @IsString()
    @IsOptional()
    @MaxLength(50, { message: 'Promo code cannot exceed 50 characters' })
    promoCode?: string;
}

