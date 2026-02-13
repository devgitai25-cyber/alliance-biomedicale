export declare class UploadService {
    private readonly uploadDir;
    constructor();
    uploadImage(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    deleteImage(imageUrl: string): Promise<void>;
}
