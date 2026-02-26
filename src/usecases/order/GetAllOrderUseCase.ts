import {
  GetAllOrdersParams,
  OrderRepository,
} from "../../data/repositories/order/OrderRepository";

const orderRepo = new OrderRepository();

export const getAllOrdersUseCase = async (params: GetAllOrdersParams = {}) => {
  return orderRepo.getAllOrders(params);
};
