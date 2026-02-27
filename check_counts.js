
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const tables = [
            'aa13_customer_db',
            'x8_app_orders_master',
            'x10_app_order_status'
        ];

        for (const t of tables) {
            const count = await prisma[t].count();
            console.log(`Table ${t}: ${count} rows`);
        }

        const lastOrders = await prisma.x8_app_orders_master.findMany({
            take: 3,
            orderBy: { id: 'desc' }
        });
        console.log('Last Orders:', JSON.stringify(lastOrders, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
