// import { OrderRepository } from "../../data/repositories/order/OrderRepository";

// const repo = new OrderRepository();

// export const getOrderUseCase = async (orderId: string) => {
//   return repo.findOrder(orderId);
// };
import { OrderRepository } from "../../data/repositories/order/OrderRepository";

const orderRepo = new OrderRepository();

export const getOrderUseCase = async (orderId: string) => {
  const order = await orderRepo.getOrder(orderId);
  return order;
};
// import { OrderRepository } from "../../data/repositories/order/OrderRepository";

// const repo = new OrderRepository();

// export const getOrderUseCase = async (orderId: string) => {
//   if (!orderId) {
//     throw new Error("OrderId is required");
//   }

//   const order = await repo.findOrder(orderId);

//   if (!order) {
//     throw new Error("Order not found");
//   }

//   return {
//     order_id: order.order_id,
//     comId: order.comId,
//     total_amount: order.total_amount,
//     discounted_amount: order.discounted_amount,
//     del_charge_amount: order.del_charge_amount,
//     created_at: order.created_at,

//     customer: order.Customer,

//     items: order.orderDetails,

//     status_history: order.orderStatus,
//   };
// };
