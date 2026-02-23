import { OrderRepository } from "../../data/repositories/order/OrderRepository";

const repo = new OrderRepository();

export const cancelOrderUseCase = async (
  orderId: string,
  updated_by?: number,
) => {
  return repo.cancelOrder(orderId, updated_by);
};