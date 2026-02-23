"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderUseCase = void 0;
const OrderRepository_1 = require("../../data/repositories/order/OrderRepository");
const orderRepo = new OrderRepository_1.OrderRepository();
/**
 * Handle order creation business logic
 * This orchestrates the transactional creation of order master, details and initial status.
 */
const createOrderUseCase = async (data) => {
    const order = await orderRepo.createOrder(data);
    return {
        message: "Order Created Successfully",
        order_id: order.order_id,
        order
    };
};
exports.createOrderUseCase = createOrderUseCase;
