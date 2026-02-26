"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusUseCase = void 0;
const OrderRepository_1 = require("../../data/repositories/order/OrderRepository");
const WalletService_1 = require("../../services/WalletService");
const orderRepo = new OrderRepository_1.OrderRepository();
const walletService = new WalletService_1.WalletService();
const updateOrderStatusUseCase = async (orderId, status, updated_by) => {
    const updatedStatus = await orderRepo.updateStatusByOrderId(orderId, status, updated_by);
    // COIN LOGIC: If status is DELIVERED, process coin generation
    if (status === OrderRepository_1.OrderStatus.DELIVERED) {
        try {
            const order = await orderRepo.getOrder(orderId);
            if (order && order.comId) {
                const totalAmount = Number(order.total_amount) || 0;
                await walletService.processOrderDelivery(orderId, order.comId, totalAmount);
            }
        }
        catch (err) {
            console.error("Error processing coin delivery:", err);
            // We don't throw here to avoid failing the status update itself
        }
    }
    return { message: "Status Updated Successfully", updatedStatus };
};
exports.updateOrderStatusUseCase = updateOrderStatusUseCase;
//# sourceMappingURL=UpdateStatusUseCase.js.map