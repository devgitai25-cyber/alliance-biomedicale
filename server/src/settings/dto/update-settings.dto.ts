import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class UpdateSettingDto {
    @IsOptional()
    value: any;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;
}
