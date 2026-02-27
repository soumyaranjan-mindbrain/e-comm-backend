
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const statuses = await prisma.x10_app_order_status.findMany({
            take: 5,
            orderBy: { id: 'desc' },
            select: {
                id: true,
                order_id: true,
                order_status: true,
                comId: true
            }
        });
        console.log('--- RECENT STATUS HISTORY ---');
        console.log(JSON.stringify(statuses, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
