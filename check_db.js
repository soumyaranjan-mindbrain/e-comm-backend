
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const orders = await prisma.x8_app_orders_master.findMany({
            take: 5,
            orderBy: { id: 'desc' },
            include: { orderStatus: true }
        });
        console.log('--- RECENT ORDERS ---');
        console.log(JSON.stringify(orders, null, 2));

        // Check if there are orphaned status records
        const statuses = await prisma.x10_app_order_status.findMany({
            take: 5,
            orderBy: { id: 'desc' },
            where: {
                NOT: {
                    order_id: { in: orders.map(o => o.order_id) }
                }
            }
        });
        console.log('--- POTENTIAL ORPHANED STATUSES ---');
        console.log(JSON.stringify(statuses, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
