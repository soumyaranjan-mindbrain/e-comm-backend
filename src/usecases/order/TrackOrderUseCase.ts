// import { OrderRepository } from "../../data/repositories/order/OrderRepository";

// const repo = new OrderRepository();

// export const trackOrderUseCase = async (orderId: string) => {
//   return repo.getTracking(orderId);
// };
import { OrderRepository } from "../../data/repositories/order/OrderRepository";

const orderRepo = new OrderRepository();

export const trackOrderUseCase = async (orderId: string) => {
  const history = await orderRepo.trackOrder(orderId);
  return history;
};
// import { OrderRepository } from "../../data/repositories/order/OrderRepository";

// const repo = new OrderRepository();

// export const trackOrderUseCase = async (orderId: string) => {
//   if (!orderId) {
//     throw new Error("OrderId is required");
//   }

//   const tracking = await repo.getTracking(orderId);

//   if (!tracking) {
//     throw new Error("Order not found");
//   }

//   const latestStatus = tracking.orderStatus[tracking.orderStatus.length - 1];

//   return {
//     order_id: tracking.order_id,
//     comId: tracking.comId,
//     current_status: latestStatus?.order_status,
//     timeline: tracking.orderStatus,
//   };
// };
