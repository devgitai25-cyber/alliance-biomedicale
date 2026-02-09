import {
    IsEnum,
    IsOptional,
    IsString,
    MaxLength
} from 'class-validator';

export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    PAID = 'PAID',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export class UpdateOrderStatusDto {
    @IsEnum(OrderStatus, { message: 'Invalid status value' })
    status: OrderStatus;

    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Notes cannot exceed 500 characters' })
    notes?: string;
}
