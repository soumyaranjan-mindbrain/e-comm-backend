"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrdersUseCase = void 0;
const OrderRepository_1 = require("../../data/repositories/order/OrderRepository");
const orderRepo = new OrderRepository_1.OrderRepository();
/**
 * Get all orders with pagination
 */
const getAllOrdersUseCase = async (params = {}) => {
    return orderRepo.getAllOrders(params);
};
exports.getAllOrdersUseCase = getAllOrdersUseCase;
