import { Prisma, caa1_shop_stock_item_db_status } from "@prisma/client";
import prisma from "../../../prisma-client";

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
  delivery_date?: string;
  coinsToRedeem?: number;
}

export class OrderRepository {
  /**
   * Create a new order — uses our BM00X order ID format
   */
  async createOrder(data: OrderInput) {
    // Get next sequential ID to generate BM00X format
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

      // 3. Create Initial Status (Raw SQL for robustness on teammate laptops)
      await tx.$executeRaw`
        INSERT INTO x10_app_order_status 
          (order_id, order_status, com_id)
        VALUES 
          (${orderId}, ${OrderStatus.PENDING}, ${data.comId ?? null})
      `;

      return order;
    });
  }

  /**
   * Get product by ID
   */
  async getProductById(productId: number) {
    return (prisma as any).productRegister.findUnique({
      where: { productId: productId },
    });
  }

  /**
   * Get shop stock item by product ID
   */
  async getShopStockItem(productId: number) {
    return (prisma as any).shopStockItem.findFirst({
      where: { itemId: productId, status: caa1_shop_stock_item_db_status.ONE },
    });
  }

  /**
   * Update order status and return the new status entry
   */
  async updateStatusByOrderId(
    orderId: string,
    status: OrderStatus,
    updated_by?: number,
  ) {
    return this.updateStatusWithDetails(orderId, status, { updated_by });
  }

  /**
   * Update order status with additional cancellation details
   * Uses raw SQL to ensure cancel_reason is written regardless of client version
   */
  async updateStatusWithDetails(
    orderId: string,
    status: OrderStatus,
    details: {
      updated_by?: number;
      cancel_reason?: string;
      cancelled_by_type?: string;
    },
  ) {
    // Insert via raw SQL so cancel_reason and snapshot columns are always written correctly
    await prisma.$executeRaw`
      INSERT INTO x10_app_order_status
        (order_id, order_status, cancel_reason, updated_by, total_amount, discounted_amount, del_charge_amount, tax_amount_b_coins, net_amount_payment_mode, quantity)
      VALUES
        (${orderId}, ${status}, ${details.cancel_reason ?? null}, ${details.updated_by ?? null}, 
         ${(details as any).total_amount ?? null}, ${(details as any).discounted_amount ?? null}, 
         ${(details as any).del_charge_amount ?? null}, ${(details as any).tax_amount_b_coins ?? null}, 
         ${(details as any).net_amount_payment_mode ?? null}, ${(details as any).quantity ?? null})
    `;

    // Also update the master record status for consistency
    await (prisma as any).x8_app_orders_master.update({
      where: { order_id: orderId },
      data: { status },
    });

    // Return the newly inserted row
    const rows = await prisma.$queryRaw<any[]>`
      SELECT * FROM x10_app_order_status
      WHERE order_id = ${orderId}
      ORDER BY id DESC
      LIMIT 1
    `;
    return rows[0];
  }

  /**
   * Cancel order wrapper
   */
  async cancelOrder(
    orderId: string,
    details: {
      updated_by?: number;
      cancel_reason?: string;
      cancelled_by_type?: string;
    },
  ) {
    return this.updateStatusWithDetails(orderId, OrderStatus.CANCELLED, details);
  }

  /**
   * Get main order by ID with details and status history
   */
  async getOrder(orderId: string) {
    return (prisma as any).x8_app_orders_master.findUnique({
      where: { order_id: orderId },
      include: {
        orderDetails: true,
        orderStatus: {
          orderBy: { id: "desc" },
        },
      },
    });
  }

  /**
   * Get all orders with optional pagination and filters
   */
  async getAllOrders(params: {
    page?: number;
    limit?: number;
    status?: string;
    comId?: number;
  } = {}) {
    const { page = 1, limit = 10, status, comId } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (comId !== undefined) where.comId = comId;
    if (status) {
      where.orderStatus = { some: { order_status: status } };
    }

    const totalOrders = await (prisma as any).x8_app_orders_master.count({ where });

    const orders = await (prisma as any).x8_app_orders_master.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip,
      take: limit,
      include: {
        orderDetails: true,
        orderStatus: {
          orderBy: { id: "desc" },
          take: 1,
        },
      },
    });

    return {
      data: orders,
      pagination: {
        total: totalOrders,
        page,
        limit,
        totalPages: Math.ceil(totalOrders / limit),
      },
    };
  }

  /**
   * Track order history with items (enhanced)
   */
  async trackOrder(orderId: string) {
    return (prisma as any).x10_app_order_status.findMany({
      where: { order_id: orderId },
      orderBy: { created_at: "asc" },
      include: {
        orderDetail: {
          select: {
            qnty: true,
            rate: true,
          },
        },
        orderMaster: {
          include: {
            orderDetails: {
              select: {
                qnty: true,
                rate: true,
                product_id: true,
              },
            },
          },
        },
      },
    });
  }
}
