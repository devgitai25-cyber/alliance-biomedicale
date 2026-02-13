import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
    private readonly uploadDir: string;

    constructor() {
        this.uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
        // Ensure upload directory exists
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    async uploadImage(file: Express.Multer.File): Promise<{ url: string }> {
        const ext = path.extname(file.originalname) || '.jpg';
        const filename = `${uuidv4()}${ext}`;
        const filePath = path.join(this.uploadDir, filename);

        fs.writeFileSync(filePath, file.buffer);

        // Return relative URL — Nginx serves /uploads/ from the volume
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
