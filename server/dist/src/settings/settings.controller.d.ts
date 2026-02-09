import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-settings.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getPublicSettings(): Promise<{}>;
    getAllSettings(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: import("@prisma/client/runtime/library").JsonValue;
        isPublic: boolean;
        key: string;
    }[]>;
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
