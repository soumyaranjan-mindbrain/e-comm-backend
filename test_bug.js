
const { OrderRepository } = require('./dist/data/repositories/order/OrderRepository');
const repo = new OrderRepository();

async function test() {
    try {
        console.log('Testing getAllOrders with status...');
        const result = await repo.getAllOrders({ status: 'PENDING' });
        console.log('Result:', result);
    } catch (e) {
        console.error('Caught expected error:', e.message);
    }
}

test();
