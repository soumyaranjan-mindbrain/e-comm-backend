import { OrderRepository, OrderStatus } from "../../data/repositories/order/OrderRepository";

const orderRepo = new OrderRepository();

export const updateOrderStatusUseCase = async (orderId: string, status: OrderStatus, updated_by?: number) => {
  const updatedStatus = await orderRepo.updateStatusByOrderId(orderId, status, updated_by);
  return { message: "Status Updated Successfully", updatedStatus };
};
