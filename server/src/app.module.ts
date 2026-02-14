import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { UploadModule } from './upload/upload.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { PromotionsModule } from './promotions/promotions.module';
import { CategoriesModule } from './categories/categories.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,    // 60 seconds window
      limit: 30,     // 30 requests per window per IP
    }]),
    PrismaModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    UploadModule,
    WishlistModule,
    PromotionsModule,
    CategoriesModule,
    DashboardModule,
    SettingsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
