"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = exports.OrderStatus = void 0;
const client_1 = require("@prisma/client");
const prisma_client_1 = __importDefault(require("../../../prisma-client"));
const product_image_1 = require("../../../utils/product-image");
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
     * Helper to add productName and productImage to order items
     */
    enrichOrder(order) {
        if (!order)
            return null;
        // 1. Flatten items inside orderDetails
        if (order.orderDetails && Array.isArray(order.orderDetails)) {
            order.orderDetails = order.orderDetails.map((item) => {
                const mainImg = (0, product_image_1.getProductMainImage)(item.product) || "";
                return {
                    ...item,
                    productName: item.product?.productName || "",
                    productImage: mainImg,
                    // For backup compatibility
                    image: mainImg,
                };
            });
            // 2. Pull the FIRST item's details to the top level of the Order object
            // This is what the "My Orders" list view usually expects.
            if (order.orderDetails.length > 0) {
                const first = order.orderDetails[0];
                order.productName = order.productName || first.productName;
                order.productImage = order.productImage || first.productImage;
                order.image = order.image || first.productImage;
            }
        }
        return order;
    }
    /**
     * Create a new order — uses our BM00X order ID format
     */
    async createOrder(data) {
        // Get next sequential ID to generate BM00X format
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
                include: {
                    orderDetails: {
                        include: {
                            product: {
                                select: {
                                    productName: true,
                                    proimg: true,
                                    images: { select: { proimgs: true }, take: 1 }
                                }
                            }
                        }
                    }
                }
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
            // 3. Create Initial Status (Raw SQL for robustness on teammate laptops)
            await tx.$executeRaw `
        INSERT INTO x10_app_order_status 
          (order_id, order_status, com_id)
        VALUES 
          (${orderId}, ${OrderStatus.PENDING}, ${data.comId ?? null})
      `;
            // We re-fetch to ensure the orderDetails we created above are included with product info
            const finalOrder = await tx.x8_app_orders_master.findUnique({
                where: { order_id: orderId },
                include: {
                    orderDetails: {
                        include: {
                            product: {
                                select: {
                                    productName: true,
                                    proimg: true,
                                    images: { select: { proimgs: true }, take: 1 }
                                }
                            }
                        }
                    }
                }
            });
            // 4. Clear user's cart after successful order placement
            await tx.x5_app_cart.updateMany({
                where: {
                    comId: data.comId,
                    isDeleted: false,
                },
                data: {
                    isDeleted: true,
                },
            });
            return this.enrichOrder(finalOrder);
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
     * Update order status and return the new status entry
     */
    async updateStatusByOrderId(orderId, status, updated_by) {
        return this.updateStatusWithDetails(orderId, status, { updated_by });
    }
    /**
     * Update order status with additional cancellation details
     * Uses raw SQL to ensure cancel_reason is written regardless of client version
     */
    async updateStatusWithDetails(orderId, status, details) {
        // Insert via raw SQL so cancel_reason and snapshot columns are always written correctly
        await prisma_client_1.default.$executeRaw `
      INSERT INTO x10_app_order_status
        (order_id, order_status, cancel_reason, updated_by, total_amount, discounted_amount, del_charge_amount, tax_amount_b_coins, net_amount_payment_mode, quantity)
      VALUES
        (${orderId}, ${status}, ${details.cancel_reason ?? null}, ${details.updated_by ?? null}, 
         ${details.total_amount ?? null}, ${details.discounted_amount ?? null}, 
         ${details.del_charge_amount ?? null}, ${details.tax_amount_b_coins ?? null}, 
         ${details.net_amount_payment_mode ?? null}, ${details.quantity ?? null})
    `;
        // Also update the master record status for consistency
        await prisma_client_1.default.x8_app_orders_master.update({
            where: { order_id: orderId },
            data: { status },
        });
        // Return the newly inserted row, enhanced with order master and flattened names/images
        const row = await prisma_client_1.default.x10_app_order_status.findFirst({
            where: { order_id: orderId },
            orderBy: { id: "desc" },
            include: {
                orderMaster: {
                    include: {
                        orderDetails: {
                            include: {
                                product: {
                                    select: {
                                        productName: true,
                                        proimg: true,
                                        images: { select: { proimgs: true }, take: 1 }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        if (row && row.orderMaster) {
            row.orderMaster = this.enrichOrder(row.orderMaster);
        }
        return row;
    }
    /**
     * Cancel order wrapper
     */
    async cancelOrder(orderId, details) {
        return this.updateStatusWithDetails(orderId, OrderStatus.CANCELLED, details);
    }
    /**
     * Get main order by ID with details and status history
     */
    async getOrder(orderId) {
        const order = await prisma_client_1.default.x8_app_orders_master.findUnique({
            where: { order_id: orderId },
            include: {
                orderDetails: {
                    include: {
                        product: {
                            select: {
                                productName: true,
                                proimg: true,
                                images: { select: { proimgs: true }, take: 1 }
                            }
                        }
                    }
                },
                orderStatus: {
                    orderBy: { id: "desc" },
                },
            },
        });
        return this.enrichOrder(order);
    }
    /**
     * Get all orders with optional pagination and filters
     */
    async getAllOrders(params = {}) {
        const { page = 1, limit = 10, status, comId } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (comId !== undefined)
            where.comId = comId;
        if (status) {
            where.orderStatus = { some: { order_status: status } };
        }
        const totalOrders = await prisma_client_1.default.x8_app_orders_master.count({ where });
        const orders = await prisma_client_1.default.x8_app_orders_master.findMany({
            where,
            orderBy: { created_at: "desc" },
            skip,
            take: limit,
            include: {
                orderDetails: {
                    include: {
                        product: {
                            select: {
                                productName: true,
                                proimg: true,
                                images: { select: { proimgs: true }, take: 1 }
                            }
                        }
                    }
                },
                orderStatus: {
                    orderBy: { id: "desc" },
                    take: 1,
                },
            },
        });
        return {
            data: orders.map((o) => this.enrichOrder(o)),
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
    async trackOrder(orderId) {
        const history = await prisma_client_1.default.x10_app_order_status.findMany({
            where: { order_id: orderId },
            orderBy: { created_at: "asc" },
            include: {
                orderDetail: {
                    include: {
                        product: {
                            select: {
                                productName: true,
                                proimg: true,
                                images: { select: { proimgs: true }, take: 1 }
                            }
                        }
                    }
                },
                orderMaster: {
                    include: {
                        orderDetails: {
                            include: {
                                product: {
                                    select: {
                                        productName: true,
                                        proimg: true,
                                        images: { select: { proimgs: true }, take: 1 }
                                    }
                                }
                            }
                        },
                    },
                },
            },
        });
        return history.map((item) => {
            // Basic enriched item with original fields + order_id
            const enrichedItem = {
                ...item,
                order_id: item.order_id || orderId,
            };
            // Find the best possible name/image for this row
            let pName = "";
            let pImg = "";
            if (item.orderDetail?.product) {
                const p = item.orderDetail.product;
                pName = p.productName || "";
                pImg = (0, product_image_1.getProductMainImage)(p) || "";
            }
            else if (item.orderMaster?.orderDetails?.[0]?.product) {
                const p = item.orderMaster.orderDetails[0].product;
                pName = p.productName || "";
                pImg = (0, product_image_1.getProductMainImage)(p) || "";
            }
            // Add to top level
            enrichedItem.productName = pName;
            enrichedItem.productImage = pImg;
            enrichedItem.image = pImg;
            // Also enrich the nested objects for safety
            if (item.orderDetail) {
                enrichedItem.orderDetail = {
                    ...item.orderDetail,
                    productName: pName,
                    productImage: pImg,
                    image: pImg,
                };
            }
            if (item.orderMaster) {
                enrichedItem.orderMaster = this.enrichOrder(item.orderMaster);
            }
            return enrichedItem;
        });
    }
}
exports.OrderRepository = OrderRepository;
