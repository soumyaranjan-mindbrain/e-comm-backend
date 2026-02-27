import prisma from "../../../prisma-client";
import { Prisma } from "@prisma/client";

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface OrderItemInput {
  productId: number;
  qnty: number;
  rate: number;
  net_amount: number;
}

export interface OrderInput {
  comId: number;
  items: OrderItemInput[];
  total_amount: number;
  discounted_amount?: number;
  del_charge_amount?: number;
  tax_amount_b_coins?: number;
  payment_mode: string;
  coinsToRedeem?: number;
}

export interface GetAllOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  comId?: number;
}

export class OrderRepository {
  /**
   * Create an order with details and initial status
   */
  async createOrder(data: OrderInput) {
    // 1. Get the latest record to determine the next sequential ID
    // We do this outside the main transaction to get the "absolute" next ID
    const lastOrder = await prisma.x8_app_orders_master.findFirst({
      orderBy: { id: "desc" },
      select: { id: true },
    });

    const nextId = (lastOrder?.id || 0) + 1;
    const orderId = `BM00${nextId}`;

    return await prisma.$transaction(async (tx: any) => {
      let finalDiscount = data.discounted_amount || 0;

      // --- WALLET REDEMPTION ---
      if (data.coinsToRedeem && data.coinsToRedeem > 0) {
        const { WalletService } = require("../../../services/WalletService");
        const walletService = new WalletService();
        const redeemed = await walletService.redeemCoins(
          data.comId,
          orderId,
          data.coinsToRedeem,
          data.total_amount,
          tx
        );
        finalDiscount += redeemed;
      }

      // 1. Create Order Master
      const order = await tx.x8_app_orders_master.create({
        data: {
          order_id: orderId,
          comId: data.comId,
          total_amount: new Prisma.Decimal(data.total_amount),
          discounted_amount: new Prisma.Decimal(finalDiscount),
          del_charge_amount: data.del_charge_amount
            ? new Prisma.Decimal(data.del_charge_amount)
            : new Prisma.Decimal(0),
          tax_amount_b_coins: data.tax_amount_b_coins
            ? new Prisma.Decimal(data.tax_amount_b_coins)
            : new Prisma.Decimal(0),
          net_amount_payment_mode: data.payment_mode,
          status: OrderStatus.PENDING,
        },
      });

      // 2. Create Order Details
      await tx.x9_app_order_details.createMany({
        data: data.items.map((item) => ({
          order_id: orderId,
          product_id: item.productId,
          qnty: item.qnty,
          rate: new Prisma.Decimal(item.rate),
          net_amount: new Prisma.Decimal(item.net_amount),
          comId: data.comId,
        })),
      });

      // 3. Create Initial Status
      await tx.x10_app_order_status.create({
        data: {
          order_id: orderId,
          order_status: OrderStatus.PENDING,
          comId: data.comId,
        },
      });

      return order;
    });
  }

  /**
   * Update order status
   */
  async updateStatusByOrderId(
    orderId: string,
    status: OrderStatus,
    updated_by?: number
  ) {
    return await prisma.$transaction(async (tx) => {
      // Get order details to get comId
      const order = await tx.x8_app_orders_master.findUnique({
        where: { order_id: orderId },
        select: { comId: true },
      });

      // 1. Create history record
      const history = await tx.x10_app_order_status.create({
        data: {
          order_id: orderId,
          order_status: status,
          updated_by: updated_by,
          comId: order?.comId,
        },
      });

      // 2. Update master record for easy display/filter
      await (tx as any).x8_app_orders_master.update({
        where: { order_id: orderId },
        data: { status: status },
      });

      return history;
    });
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, updated_by?: number) {
    return this.updateStatusByOrderId(
      orderId,
      OrderStatus.CANCELLED,
      updated_by
    );
  }

  /**
   * Get order with details
   */
  async getOrder(orderId: string) {
    return (prisma as any).x8_app_orders_master.findUnique({
      where: { order_id: orderId },
      include: {
        orderDetails: true,
        orderStatus: true,
      },
    });
  }

  /**
   * Get all orders with optional pagination and filters
   */
  async getAllOrders(params: GetAllOrdersParams = {}) {
    const { page = 1, limit = 50, status, comId } = params;

    const where: any = {};
    if (status) where.status = status;
    if (comId !== undefined) where.comId = comId;

    return (prisma as any).x8_app_orders_master.findMany({
      where,
      include: {
        orderDetails: true,
        orderStatus: true,
      },
      orderBy: {
        created_at: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  /**
   * Track order history
   */
  async trackOrder(orderId: string) {
    return (prisma as any).x10_app_order_status.findMany({
      where: { order_id: orderId },
      orderBy: { created_at: "asc" },
    });
  }
}
