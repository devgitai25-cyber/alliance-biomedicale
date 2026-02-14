/**
 * Bulk compress existing images in the uploads directory.
 * Run: npx tsx scripts/compress-existing-images.ts
 *
 * Converts all jpg/jpeg/png images to compressed WebP format.
 * Keeps the original filenames but changes extension to .webp.
 * Backs up originals to uploads/originals/ before converting.
 */
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
const BACKUP_DIR = path.join(UPLOAD_DIR, 'originals');
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const QUALITY = 80;

async function main() {
    console.log(`📁 Scanning: ${UPLOAD_DIR}`);

    if (!fs.existsSync(UPLOAD_DIR)) {
        console.log('❌ Upload directory not found');
        return;
    }

    // Create backup dir
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const files = fs.readdirSync(UPLOAD_DIR).filter(f => {
        const ext = path.extname(f).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) && !fs.statSync(path.join(UPLOAD_DIR, f)).isDirectory();
    });

    console.log(`📷 Found ${files.length} images to process\n`);

    let totalOriginal = 0;
    let totalCompressed = 0;
    let processed = 0;
    let skipped = 0;

    for (const file of files) {
        const filePath = path.join(UPLOAD_DIR, file);
        const originalStats = fs.statSync(filePath);
        const originalSize = originalStats.size;

        // Skip files that are already small (< 50KB)
        if (originalSize < 50 * 1024) {
            console.log(`⏭️  ${file} — already small (${Math.round(originalSize / 1024)}KB), skipping`);
            skipped++;
            continue;
        }

        const baseName = path.basename(file, path.extname(file));
        const outputName = `${baseName}.webp`;
        const outputPath = path.join(UPLOAD_DIR, outputName);

        try {
            // Backup original
            fs.copyFileSync(filePath, path.join(BACKUP_DIR, file));

            // Compress
            await sharp(filePath)
                .resize(MAX_WIDTH, MAX_HEIGHT, {
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                .webp({ quality: QUALITY })
                .toFile(outputPath + '.tmp');

            // If output is a different filename, remove old and rename
            const compressedStats = fs.statSync(outputPath + '.tmp');

            if (file !== outputName && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Remove original extension file
            }
            fs.renameSync(outputPath + '.tmp', outputPath);

            const reduction = Math.round((1 - compressedStats.size / originalSize) * 100);
            console.log(
                `✅ ${file} → ${outputName}: ${Math.round(originalSize / 1024)}KB → ${Math.round(compressedStats.size / 1024)}KB (${reduction}% smaller)`,
            );

            totalOriginal += originalSize;
            totalCompressed += compressedStats.size;
            processed++;
        } catch (err) {
            console.log(`❌ ${file}: ${err.message}`);
        }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Processed: ${processed} images`);
    console.log(`   Skipped: ${skipped} images (already small)`);
    console.log(`   Total original: ${Math.round(totalOriginal / 1024 / 1024 * 100) / 100} MB`);
    console.log(`   Total compressed: ${Math.round(totalCompressed / 1024 / 1024 * 100) / 100} MB`);
    console.log(`   Saved: ${Math.round((totalOriginal - totalCompressed) / 1024 / 1024 * 100) / 100} MB`);
    console.log(`\n💡 Originals backed up to: ${BACKUP_DIR}`);
    console.log(`⚠️  NOTE: If your database stores image URLs with the old extension (e.g., .jpg),`);
    console.log(`   you need to update them to .webp in the database.`);
}

main().catch(console.error);
