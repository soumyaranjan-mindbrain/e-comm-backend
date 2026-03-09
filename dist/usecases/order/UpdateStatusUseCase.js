"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusUseCase = void 0;
const OrderRepository_1 = require("../../data/repositories/order/OrderRepository");
const orderRepo = new OrderRepository_1.OrderRepository();
/**
 * Update order status — robust version
 * Updates both the master status and the tracking history
 */
const updateOrderStatusUseCase = async (orderId, status, updated_by, additionalData) => {
    const result = await orderRepo.updateStatusWithDetails(orderId, status, {
        updated_by,
        ...additionalData
    });
    return {
        message: "Status Updated Successfully",
        data: result,
    };
};
exports.updateOrderStatusUseCase = updateOrderStatusUseCase;
