"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusUseCase = void 0;
const OrderRepository_1 = require("../../data/repositories/order/OrderRepository");
const orderRepo = new OrderRepository_1.OrderRepository();
const updateOrderStatusUseCase = async (orderId, status, updated_by) => {
    const updatedStatus = await orderRepo.updateStatusByOrderId(orderId, status, updated_by);
    return { message: "Status Updated Successfully", updatedStatus };
};
exports.updateOrderStatusUseCase = updateOrderStatusUseCase;
