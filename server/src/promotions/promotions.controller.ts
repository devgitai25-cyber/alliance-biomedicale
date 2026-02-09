import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';

@Controller('promotions')
export class PromotionsController {
    constructor(private readonly promotionsService: PromotionsService) { }

    @Get('validate')
    async validateCode(
        @Query('code') code: string,
        @Query('subtotal') subtotal: string,
    ) {
        return this.promotionsService.validateCode(code, parseFloat(subtotal));
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll() {
        return this.promotionsService.findAll();
    }
}
