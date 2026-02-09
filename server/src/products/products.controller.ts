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
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly cloudinaryService: CloudinaryService,
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
            const result = await this.cloudinaryService.uploadImage(file);
            imageUrl = result.secure_url;
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
            const result = await this.cloudinaryService.uploadImage(file);
            // Append new image to existing images or replace? 
            // For simplicity in this iteration, let's just add it to the list
            // Note: In a real app, we might want to manage specific images (delete old one etc)
            // But here we'd need to fetch existing first or just trust the DTO + new file

            // If DTO has images, use those + new file
            // The DTO images might be JSON string due to FormData limitation, from frontend we usually send array
            // But if it comes as form-data, complex arrays might be messy.

            // For now, assuming we want to overwrite or add to existing if managed by client logic.
            // Simplified logic: treat the uploaded file as the ONLY image or primary image if we were replacing.
            // But code above just pushes to array if provided.

            // Let's just create an array with this image for now if images is empty, or push to it.
            // Since we receive a DTO, we should respect it.
            // But typically update with file upload might be tricky with DTO validation.

            // Ideally:
            const currentImages = updateProductDto.images || [];
            if (Array.isArray(currentImages)) {
                currentImages.push(result.secure_url);
            } else {
                // if it's a string (from form-data messing up array), make it array
                updateProductDto.images = [currentImages, result.secure_url];
            }
            // Actually, type transformation in DTO handles string -> array. 
            // So we can assume it's array or undefined.
            if (!updateProductDto.images) {
                updateProductDto.images = [];
            }
            updateProductDto.images.push(result.secure_url);
        }

        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
