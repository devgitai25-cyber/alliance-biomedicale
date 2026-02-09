import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-settings.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getPublicSettings(): Promise<{}>;
    getAllSettings(): Promise<{
        id: string;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
        description: string | null;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
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
