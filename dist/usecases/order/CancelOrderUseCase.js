"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrderUseCase = void 0;
const OrderRepository_1 = require("../../data/repositories/order/OrderRepository");
const repo = new OrderRepository_1.OrderRepository();
const cancelOrderUseCase = async (orderId, updated_by) => {
    return repo.cancelOrder(orderId, updated_by);
};
exports.cancelOrderUseCase = cancelOrderUseCase;
