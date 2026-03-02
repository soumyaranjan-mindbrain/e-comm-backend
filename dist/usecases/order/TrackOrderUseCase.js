"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackOrderUseCase = void 0;
const OrderRepository_1 = require("../../data/repositories/order/OrderRepository");
const utils_1 = require("../../utils");
const orderRepo = new OrderRepository_1.OrderRepository();
/**
 * Handle order tracking business logic
 */
const trackOrderUseCase = async (orderId) => {
    const history = await orderRepo.trackOrder(orderId);
    return (0, utils_1.formatDecimal)(history);
};
exports.trackOrderUseCase = trackOrderUseCase;
