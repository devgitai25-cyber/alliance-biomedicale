import { Controller, Get, Post, Body, Param, Patch, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard, AdminGuard } from '../auth/guards/auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
        // Extract userId if available (custom middleware might attach user even without guard)
        // Or check header manualy if JwtAuthGuard isn't used
        const userId = req.user?.id;
        return this.ordersService.create(createOrderDto, userId);
    }

    @Get()
    findAll() {
        return this.ordersService.findAll();
    }

    @Get('my-orders')
    @UseGuards(JwtAuthGuard)
    async findMyOrders(@Req() req) {
        console.log('findMyOrders called for user:', req.user);
        const orders = await this.ordersService.findByUser(req.user.id);
        console.log('findMyOrders result:', orders);
        return orders;
    }

    // IMPORTANT: PATCH :id/status must come BEFORE GET :id
    // Otherwise, NestJS will match ':id/status' as ':id' with id='status'
    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async updateStatus(
        @Param('id') id: string,
        @Body() updateStatusDto: UpdateOrderStatusDto
    ) {
        return this.ordersService.updateStatus(id, updateStatusDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }
}
