
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProduct() {
    try {
        const product = await prisma.productRegister.findFirst({
            where: { productName: 'Intelligent Wooden Pizza' },
            include: {
                images: true
            }
        });

        if (!product) {
            console.log('❌ Product not found');
            return;
        }

        console.log('✅ Product found:');
        console.log(JSON.stringify(product, null, 2));
    } catch (error) {
        console.error('💥 Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkProduct();
