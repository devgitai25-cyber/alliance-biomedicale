/**
 * Clean base64 image data from the database.
 * Run: cd /app && node scripts/clean-base64-images.js
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Scanning for base64 image data in database...\n');

    // Clean categories
    const categories = await prisma.category.findMany();
    let catCleaned = 0;

    for (const cat of categories) {
        if (cat.image && cat.image.startsWith('data:')) {
            const sizeKB = Math.round(cat.image.length / 1024);
            console.log(`Category "${cat.name}": removing ${sizeKB}KB base64 image`);
            await prisma.category.update({
                where: { id: cat.id },
                data: { image: null },
            });
            catCleaned++;
        }
    }

    // Clean products
    const products = await prisma.product.findMany();
    let prodCleaned = 0;

    for (const prod of products) {
        const cleanImages = prod.images.filter(img => !img.startsWith('data:'));
        const removedCount = prod.images.length - cleanImages.length;

        if (removedCount > 0) {
            const totalSizeKB = prod.images
                .filter(img => img.startsWith('data:'))
                .reduce((sum, img) => sum + img.length, 0);
            console.log(`Product "${prod.name}": removing ${removedCount} base64 image(s) (${Math.round(totalSizeKB / 1024)}KB)`);
            await prisma.product.update({
                where: { id: prod.id },
                data: { images: cleanImages },
            });
            prodCleaned++;
        }
    }

    console.log(`\nSummary:`);
    console.log(`  Categories cleaned: ${catCleaned}/${categories.length}`);
    console.log(`  Products cleaned: ${prodCleaned}/${products.length}`);

    if (catCleaned > 0 || prodCleaned > 0) {
        console.log(`\nImages removed. Re-upload via admin panel.`);
    } else {
        console.log(`\nNo base64 images found - database is clean!`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
