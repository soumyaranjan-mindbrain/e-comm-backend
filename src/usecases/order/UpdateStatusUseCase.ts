import { OrderRepository, OrderStatus } from "../../data/repositories/order/OrderRepository";

const orderRepo = new OrderRepository();

/**
 * Update order status — robust version
 * Updates both the master status and the tracking history
 */
export const updateOrderStatusUseCase = async (
  orderId: string,
  status: OrderStatus,
  updated_by?: number,
  additionalData?: {
    cancel_reason?: string;
    cancelled_by_type?: string;
    total_amount?: number;
    discounted_amount?: number;
    del_charge_amount?: number;
    tax_amount_b_coins?: number;
    net_amount_payment_mode?: string;
    quantity?: number;
  },
) => {
  const result = await orderRepo.updateStatusWithDetails(orderId, status, {
    updated_by,
    ...additionalData
  });

  return {
    message: "Status Updated Successfully",
    data: result,
  };
};
