import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.settings.findMany();
    }

    async findPublic() {
        // Return key-value pairs for easier frontend consumption
        const settings = await this.prisma.settings.findMany({
            where: { isPublic: true },
        });

        return settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {});
    }

    async findOne(key: string) {
        const setting = await this.prisma.settings.findUnique({
            where: { key },
        });

        if (!setting) {
            throw new NotFoundException(`Setting with key ${key} not found`);
        }

        return setting;
    }

    async update(key: string, updateSettingDto: UpdateSettingDto) {
        // Check if setting exists
        await this.findOne(key);

        return this.prisma.settings.update({
            where: { key },
            data: updateSettingDto,
        });
    }
}
