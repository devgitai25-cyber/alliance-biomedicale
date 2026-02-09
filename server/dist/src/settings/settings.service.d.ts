import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingDto } from './dto/update-settings.dto';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
        description: string | null;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findPublic(): Promise<{}>;
    findOne(key: string): Promise<{
        id: string;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
        description: string | null;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(key: string, updateSettingDto: UpdateSettingDto): Promise<{
        id: string;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
        description: string | null;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
