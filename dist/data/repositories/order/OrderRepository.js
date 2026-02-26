"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = exports.OrderStatus = void 0;
const prisma_client_1 = __importDefault(require("../../../prisma-client"));
const crypto_1 = require("crypto");
const client_1 = require("@prisma/client");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["CONFIRMED"] = "CONFIRMED";
    OrderStatus["SHIPPED"] = "SHIPPED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
class OrderRepository {
    /**
     * Create an order with details and initial status
     */
    async createOrder(data) {
        const orderId = (0, crypto_1.randomUUID)();
        return await prisma_client_1.default.$transaction(async (tx) => {
            let finalDiscount = data.discounted_amount || 0;
            // --- WALLET REDEMPTION ---
            if (data.coinsToRedeem && data.coinsToRedeem > 0) {
                const { WalletService } = require("../../../services/WalletService");
                const walletService = new WalletService();
                const redeemed = await walletService.redeemCoins(data.comId, orderId, data.coinsToRedeem, data.total_amount, tx);
                finalDiscount += redeemed;
            }
            // 1. Create Order Master
            const order = await tx.x8_app_orders_master.create({
                data: {
                    order_id: orderId,
                    comId: data.comId,
                    total_amount: new client_1.Prisma.Decimal(data.total_amount),
                    discounted_amount: new client_1.Prisma.Decimal(finalDiscount),
                    del_charge_amount: data.del_charge_amount
                        ? new client_1.Prisma.Decimal(data.del_charge_amount)
                        : new client_1.Prisma.Decimal(0),
                    tax_amount_b_coins: data.tax_amount_b_coins
                        ? new client_1.Prisma.Decimal(data.tax_amount_b_coins)
                        : new client_1.Prisma.Decimal(0),
                    net_amount_payment_mode: data.payment_mode,
                },
            });
            // ... rest of the logic remains same
            // 2. Create Order Details
            await tx.x9_app_order_details.createMany({
                data: data.items.map((item) => ({
                    order_id: orderId,
                    product_id: item.productId,
                    qnty: item.qnty,
                    rate: new client_1.Prisma.Decimal(item.rate),
                    net_amount: new client_1.Prisma.Decimal(item.net_amount),
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
    async updateStatusByOrderId(orderId, status, updated_by) {
        // We add a new entry to the tracking table instead of updating many
        // Because x10_app_order_status is a tracking table (multiple entries per order_id)
        return prisma_client_1.default.x10_app_order_status.create({
            data: {
                order_id: orderId,
                order_status: status,
                updated_by: updated_by,
            },
        });
    }
    /**
     * Cancel order
     */
    async cancelOrder(orderId, updated_by) {
        return this.updateStatusByOrderId(orderId, OrderStatus.CANCELLED, updated_by);
    }
    /**
     * Get order with details
     */
    async getOrder(orderId) {
        return prisma_client_1.default.x8_app_orders_master.findUnique({
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
    async getAllOrders(params = {}) {
        const { page = 1, limit = 50, status, comId } = params;
        const where = {};
        if (status)
            where.status = status;
        if (comId !== undefined)
            where.comId = comId;
        return prisma_client_1.default.x8_app_orders_master.findMany({
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
    async trackOrder(orderId) {
        return prisma_client_1.default.x10_app_order_status.findMany({
            where: { order_id: orderId },
            orderBy: { created_at: "asc" },
        });
    }
}
exports.OrderRepository = OrderRepository;
