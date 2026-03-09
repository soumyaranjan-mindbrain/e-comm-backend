"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrderUseCase = void 0;
const OrderRepository_1 = require("../../data/repositories/order/OrderRepository");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const utils_1 = require("../../utils");
const orderRepo = new OrderRepository_1.OrderRepository();
/**
 * Handle order cancellation business logic
 */
const cancelOrderUseCase = async (orderId, details) => {
    // 1. Fetch order to verify existence and state
    const order = await orderRepo.getOrder(orderId);
    if (!order) {
        throw AppError_1.default.notFound(`Order with ID ${orderId} not found`);
    }
    // Get current status (latest entry — orderStatus is ordered desc)
    const currentStatus = order.orderStatus[0]?.order_status;
    if (currentStatus === OrderRepository_1.OrderStatus.CANCELLED) {
        throw AppError_1.default.badRequest("Order is already cancelled");
    }
    if (currentStatus === OrderRepository_1.OrderStatus.DELIVERED) {
        throw AppError_1.default.badRequest("Cannot cancel a delivered order");
    }
    // 2. Perform cancellation
    const result = await orderRepo.cancelOrder(orderId, details);
    // Re-fetch full order for consistent response
    const updatedOrder = await orderRepo.getOrder(orderId);
    const num_items = updatedOrder?.orderDetails.reduce((sum, item) => sum + item.qnty, 0) || 0;
    return (0, utils_1.formatDecimal)({
        ...updatedOrder,
        num_items,
        status: result.order_status,
        cancel_reason: result.cancel_reason,
        total_amount: updatedOrder?.total_amount,
        tax: updatedOrder?.tax_amount_b_coins,
        payment_method: updatedOrder?.net_amount_payment_mode,
    });
};
exports.cancelOrderUseCase = cancelOrderUseCase;
