"use strict";
// import { OrderRepository } from "../../data/repositories/order/OrderRepository";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderUseCase = void 0;
// const repo = new OrderRepository();
// export const getOrderUseCase = async (orderId: string) => {
//   return repo.findOrder(orderId);
// };
const OrderRepository_1 = require("../../data/repositories/order/OrderRepository");
const orderRepo = new OrderRepository_1.OrderRepository();
const getOrderUseCase = async (orderId) => {
    const order = await orderRepo.getOrder(orderId);
    return order;
};
exports.getOrderUseCase = getOrderUseCase;
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
//# sourceMappingURL=GetOrderUseCase.js.map