import { OrderRepository } from "../../data/repositories/order/OrderRepository";
import { formatDecimal } from "../../utils";

const orderRepo = new OrderRepository();

/**
 * Handle fetching a single order by ID
 */
export const getOrderUseCase = async (orderId: string) => {
  const order = await orderRepo.getOrder(orderId);
  if (!order) return null;

  const num_items = order.orderDetails?.reduce((sum: number, item: any) => sum + Number(item.qnty || 0), 0) ?? 0;

  return formatDecimal({
    ...order,
    num_items,
    total_amount: order.total_amount,
    tax_amount: order.tax_amount_b_coins,
    discount: order.discounted_amount,
    payment_method: order.net_amount_payment_mode,
  });
};
