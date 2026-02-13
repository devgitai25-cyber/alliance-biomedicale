import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from '../auth/guards/auth.guard';
import { UploadService } from '../upload/upload.service';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly uploadService: UploadService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('image'))
    async create(
        @Body() createProductDto: CreateProductDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        let imageUrl = '';
        if (file) {
            const result = await this.uploadService.uploadImage(file);
            imageUrl = result.url;
        }

        // Add image to DTO if it exists
        const images = createProductDto.images || [];
        if (imageUrl) {
            images.push(imageUrl);
        }

        const productData = {
            ...createProductDto,
            images,
        };

        return this.productsService.create(productData);
    }

    @Get('categories')
    findAllCategories() {
        return this.productsService.findAllCategories();
    }

    @Get()
    findAll(
        @Query('categoryId') categoryId?: string,
        @Query('featured') featured?: string,
    ) {
        return this.productsService.findAll(
            categoryId,
            featured === 'true' ? true : undefined,
        );
    }

    @Get('slug/:slug')
    findBySlug(@Param('slug') slug: string) {
        return this.productsService.findBySlug(slug);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('image'))
    async update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (file) {
            const result = await this.uploadService.uploadImage(file);
            // Append new image to existing images
            const currentImages = updateProductDto.images || [];
            if (Array.isArray(currentImages)) {
                currentImages.push(result.url);
            } else {
                updateProductDto.images = [currentImages, result.url];
            }
            if (!updateProductDto.images) {
                updateProductDto.images = [];
            }
            updateProductDto.images.push(result.url);
        }

        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
