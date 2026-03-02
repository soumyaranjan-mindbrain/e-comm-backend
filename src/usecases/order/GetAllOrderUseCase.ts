import {
  GetAllOrdersParams,
  OrderRepository,
} from "../../data/repositories/order/OrderRepository";
import { formatDecimal } from "../../utils";
import prisma from "../../prisma-client";

const orderRepo = new OrderRepository();

export const getAllOrdersUseCase = async (params: GetAllOrdersParams = {}) => {
  const { page = 1, limit = 50, status, comId } = params;
  const skip = (page - 1) * limit;

  // ✅ Build Filter
  const where: any = {};
  if (comId !== undefined) {
    where.comId = comId;
  }

  // If status is provided, we filter by the latest status in the status history
  // Actually, OrderRepository handles simple status if we use the master status field.
  // But let's use the UseCase logic for more control.
  if (status) {
    where.status = status; // Master status is updated in updateStatusByOrderId
  }

  // ✅ Total count for pagination metadata
  const total = await (prisma as any).x8_app_orders_master.count({ where });

  // ✅ Fetch data through repository (already has include logic)
  const orders = await orderRepo.getAllOrders(params);

  return formatDecimal({
    orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  });
};
