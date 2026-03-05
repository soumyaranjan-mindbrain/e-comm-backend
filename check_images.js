
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkImages() {
    try {
        const images = await prisma.productImageRegister.findMany({
            where: { productId: 10000, status: '1' }
        });
        console.log('Images with status "1":', images.length);

        const images2 = await prisma.productImageRegister.findMany({
            where: { productId: 10000, status: 'ONE' }
        });
        console.log('Images with status "ONE":', images2.length);

        const images3 = await prisma.productImageRegister.findMany({
            where: { productId: 10000 }
        });
        console.log('Total images for product:', images3.length);
        if (images3.length > 0) {
            console.log('Sample image status:', images3[0].status);
        }
    } catch (error) {
        console.error('💥 Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkImages();
