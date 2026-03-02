"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = exports.OrderStatus = void 0;
const prisma_client_1 = __importDefault(require("../../../prisma-client"));
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
        // 1. Get the latest record to determine the next sequential ID
        // We do this outside the main transaction to get the "absolute" next ID
        const lastOrder = await prisma_client_1.default.x8_app_orders_master.findFirst({
            orderBy: { id: "desc" },
            select: { id: true },
        });
        const nextId = (lastOrder?.id || 0) + 1;
        const orderId = `BM00${nextId}`;
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
                    status: OrderStatus.PENDING,
                },
            });
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
        return await prisma_client_1.default.$transaction(async (tx) => {
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
            await tx.x8_app_orders_master.update({
                where: { order_id: orderId },
                data: { status: status },
            });
            return history;
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
     * Get product by ID
     */
    async getProductById(productId) {
        return prisma_client_1.default.productRegister.findUnique({
            where: { productId: productId },
        });
    }
    /**
     * Get shop stock item by product ID
     */
    async getShopStockItem(productId) {
        return prisma_client_1.default.shopStockItem.findFirst({
            where: { itemId: productId, status: client_1.caa1_shop_stock_item_db_status.ONE },
        });
    }
    /**
     * Update order status with additional details
     */
    async updateStatusWithDetails(orderId, status, details) {
        return await prisma_client_1.default.$transaction(async (tx) => {
            // Get order details to get comId
            const order = await tx.x8_app_orders_master.findUnique({
                where: { order_id: orderId },
                select: { comId: true },
            });
            // 1. Create history record with details
            const history = await tx.x10_app_order_status.create({
                data: {
                    order_id: orderId,
                    order_status: status,
                    updated_by: details.updated_by,
                    comId: order?.comId,
                    cancel_reason: details.cancel_reason,
                    // Note: In schema x10_app_order_status doesn't have cancelled_by_type 
                    // but has cancel_by (Int). We match schema.
                },
            });
            // 2. Update master record
            await tx.x8_app_orders_master.update({
                where: { order_id: orderId },
                data: { status: status },
            });
            return history;
        });
    }
    /**
     * Track order history with items (enhanced)
     */
    async trackOrder(orderId) {
        return prisma_client_1.default.x10_app_order_status.findMany({
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
                                product_id: true
                            },
                        },
                    },
                },
            },
        });
    }
}
exports.OrderRepository = OrderRepository;
