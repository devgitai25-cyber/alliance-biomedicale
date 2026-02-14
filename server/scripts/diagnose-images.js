/**
 * Diagnose image issues.
 * Run: cd /app && node scripts/diagnose-images.js
 */
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

    console.log('=== IMAGE DIAGNOSTICS ===\n');
    console.log(`Upload directory: ${uploadDir}`);
    console.log(`Directory exists: ${fs.existsSync(uploadDir)}`);

    if (fs.existsSync(uploadDir)) {
        const files = fs.readdirSync(uploadDir);
        console.log(`Files in uploads: ${files.length}`);
        files.forEach(f => {
            const stat = fs.statSync(path.join(uploadDir, f));
            console.log(`  - ${f} (${Math.round(stat.size / 1024)}KB)`);
        });
    }

    console.log('\n=== CATEGORY IMAGES ===');
    const categories = await prisma.category.findMany({ select: { id: true, name: true, image: true } });
    for (const cat of categories) {
        const imgType = !cat.image ? 'NULL'
            : cat.image.startsWith('data:') ? `BASE64 (${Math.round(cat.image.length / 1024)}KB)`
                : cat.image;
        console.log(`  ${cat.name}: ${imgType}`);
    }

    console.log('\n=== PRODUCT IMAGES ===');
    const products = await prisma.product.findMany({ select: { id: true, name: true, images: true } });
    for (const prod of products) {
        const imgs = prod.images.map(img =>
            img.startsWith('data:') ? `BASE64(${Math.round(img.length / 1024)}KB)` : img
        );
        console.log(`  ${prod.name}: ${imgs.length > 0 ? imgs.join(', ') : 'NO IMAGES'}`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
