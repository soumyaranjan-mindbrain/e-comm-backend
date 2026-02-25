import { OrderRepository, OrderStatus } from "../../data/repositories/order/OrderRepository";
import { WalletService } from "../../services/WalletService";

const orderRepo = new OrderRepository();
const walletService = new WalletService();

export const updateOrderStatusUseCase = async (orderId: string, status: OrderStatus, updated_by?: number) => {
  const updatedStatus = await orderRepo.updateStatusByOrderId(orderId, status, updated_by);

  // COIN LOGIC: If status is DELIVERED, process coin generation
  if (status === OrderStatus.DELIVERED) {
    try {
      const order = await orderRepo.getOrder(orderId);
      if (order && order.comId) {
        const totalAmount = Number(order.total_amount) || 0;
        await walletService.processOrderDelivery(orderId, order.comId, totalAmount);
      }
    } catch (err) {
      console.error("Error processing coin delivery:", err);
      // We don't throw here to avoid failing the status update itself
    }
  }

  return { message: "Status Updated Successfully", updatedStatus };
};
