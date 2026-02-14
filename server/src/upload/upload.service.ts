import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';

@Injectable()
export class UploadService {
    private readonly uploadDir: string;
    private readonly logger = new Logger(UploadService.name);

    // Max dimensions for uploaded images
    private readonly MAX_WIDTH = 1200;
    private readonly MAX_HEIGHT = 1200;
    private readonly QUALITY = 80;

    constructor() {
        this.uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
        // Ensure upload directory exists
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    async uploadImage(file: Express.Multer.File): Promise<{ url: string }> {
        const filename = `${uuidv4()}.webp`;
        const filePath = path.join(this.uploadDir, filename);

        try {
            // Compress and convert to WebP
            await sharp(file.buffer)
                .resize(this.MAX_WIDTH, this.MAX_HEIGHT, {
                    fit: 'inside',          // Maintain aspect ratio, fit within bounds
                    withoutEnlargement: true // Don't upscale small images
                })
                .webp({ quality: this.QUALITY })
                .toFile(filePath);

            const stats = fs.statSync(filePath);
            const originalKB = Math.round(file.size / 1024);
            const compressedKB = Math.round(stats.size / 1024);
            this.logger.log(
                `Image compressed: ${originalKB}KB → ${compressedKB}KB (${Math.round((1 - stats.size / file.size) * 100)}% reduction)`,
            );
        } catch (error) {
            // Fallback: save original if sharp fails
            this.logger.warn(`Sharp compression failed, saving original: ${error.message}`);
            fs.writeFileSync(filePath, file.buffer);
        }

        // Return relative URL — served via /uploads/ route
        return { url: `/uploads/${filename}` };
    }

    async deleteImage(imageUrl: string): Promise<void> {
        if (!imageUrl || !imageUrl.startsWith('/uploads/')) return;
        const filename = path.basename(imageUrl);
        const filePath = path.join(this.uploadDir, filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
}
