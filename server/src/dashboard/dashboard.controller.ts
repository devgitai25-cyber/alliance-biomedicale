
import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AdminGuard, JwtAuthGuard } from '../auth/guards/auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, AdminGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('stats')
    async getStats() {
        return this.dashboardService.getStats();
    }
}
