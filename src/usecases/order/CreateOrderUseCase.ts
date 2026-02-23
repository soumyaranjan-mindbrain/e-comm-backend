import { OrderRepository, OrderInput } from "../../data/repositories/order/OrderRepository";

const orderRepo = new OrderRepository();

/**
 * Handle order creation business logic
 * This orchestrates the transactional creation of order master, details and initial status.
 */
export const createOrderUseCase = async (data: OrderInput) => {
  const order = await orderRepo.createOrder(data);
  return {
    message: "Order Created Successfully",
    order_id: order.order_id,
    order
  };
};
