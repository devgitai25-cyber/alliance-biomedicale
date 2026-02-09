import { Controller, Get, Body, Param, Put, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-settings.dto';
import { JwtAuthGuard, AdminGuard } from '../auth/guards/auth.guard';

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get('public')
    getPublicSettings() {
        return this.settingsService.findPublic();
    }

    @Get()
    @UseGuards(JwtAuthGuard, AdminGuard)
    getAllSettings() {
        return this.settingsService.findAll();
    }

    @Put(':key')
    @UseGuards(JwtAuthGuard, AdminGuard)
    update(
        @Param('key') key: string,
        @Body() updateSettingDto: UpdateSettingDto,
    ) {
        return this.settingsService.update(key, updateSettingDto);
    }
}
