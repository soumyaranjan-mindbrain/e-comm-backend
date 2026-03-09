"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderUseCase = void 0;
const OrderRepository_1 = require("../../data/repositories/order/OrderRepository");
const utils_1 = require("../../utils");
const orderRepo = new OrderRepository_1.OrderRepository();
/**
 * Get order by ID with details and status history
 */
const getOrderUseCase = async (orderId) => {
    const order = await orderRepo.getOrder(orderId);
    if (!order)
        return null;
    const num_items = order.orderDetails.reduce((acc, item) => acc + item.qnty, 0);
    return (0, utils_1.formatDecimal)({
        ...order,
        num_items,
        total_amount: order.total_amount,
        tax: order.tax_amount_b_coins,
        payment_method: order.net_amount_payment_mode,
        delivery_date: order.delivery_date,
    });
};
exports.getOrderUseCase = getOrderUseCase;
