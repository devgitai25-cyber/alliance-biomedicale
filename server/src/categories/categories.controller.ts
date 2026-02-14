import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard, AdminGuard } from '../auth/guards/auth.guard';
import { UploadService } from '../upload/upload.service';

@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService,
        private readonly uploadService: UploadService,
    ) { }

    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('image'))
    async create(
        @Body() createCategoryDto: CreateCategoryDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (file) {
            const result = await this.uploadService.uploadImage(file);
            createCategoryDto.image = result.url;
        }
        return this.categoriesService.create(createCategoryDto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('image'))
    async update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (file) {
            const result = await this.uploadService.uploadImage(file);
            updateCategoryDto.image = result.url;
        }
        return this.categoriesService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(id);
    }

    @Patch('reorder/bulk')
    @UseGuards(JwtAuthGuard, AdminGuard)
    reorder(@Body() items: { id: string; displayOrder: number }[]) {
        return this.categoriesService.reorder(items);
    }
}
