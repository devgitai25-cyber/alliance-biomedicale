import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingDto } from './dto/update-settings.dto';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: import("@prisma/client/runtime/library").JsonValue;
        isPublic: boolean;
        key: string;
    }[]>;
    findPublic(): Promise<{}>;
    findOne(key: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: import("@prisma/client/runtime/library").JsonValue;
        isPublic: boolean;
        key: string;
    }>;
    update(key: string, updateSettingDto: UpdateSettingDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: import("@prisma/client/runtime/library").JsonValue;
        isPublic: boolean;
        key: string;
    }>;
}
