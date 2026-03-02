import { OrderRepository } from "../../data/repositories/order/OrderRepository";
import { formatDecimal } from "../../utils";

const orderRepo = new OrderRepository();

/**
 * Handle order tracking business logic
 */
export const trackOrderUseCase = async (orderId: string) => {
  const history = await orderRepo.trackOrder(orderId);
  return formatDecimal(history);
};
