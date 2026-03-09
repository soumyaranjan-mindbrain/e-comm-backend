"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderUseCase = void 0;
const OrderRepository_1 = require("../../data/repositories/order/OrderRepository");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const utils_1 = require("../../utils");
const config_1 = __importDefault(require("../../config"));
const orderRepo = new OrderRepository_1.OrderRepository();
/**
 * Create Order UseCase
 * Handles validation + calculation + transactional creation
 */
const createOrderUseCase = async (data) => {
    if (!data.items || data.items.length === 0) {
        throw AppError_1.default.badRequest("Order must contain at least one item");
    }
    let calculatedSubtotal = 0;
    // Batch-fetch for all items to avoid per-item DB round trips.
    const uniqueProductIds = [...new Set(data.items.map((item) => item.productId))];
    const [products, stockItems] = await Promise.all([
        orderRepo.getProductsByIds(uniqueProductIds),
        orderRepo.getShopStockItemsByProductIds(uniqueProductIds),
    ]);
    const productMap = new Map();
    for (const product of products) {
        if (product?.productId !== null && product?.productId !== undefined) {
            productMap.set(Number(product.productId), product);
        }
    }
    const stockMap = new Map();
    for (const stock of stockItems) {
        if (stock?.itemId !== null &&
            stock?.itemId !== undefined &&
            !stockMap.has(Number(stock.itemId))) {
            stockMap.set(Number(stock.itemId), stock);
        }
    }
    // Validate Items
    for (const item of data.items) {
        const product = productMap.get(item.productId);
        if (!product) {
            throw AppError_1.default.notFound(`Product with ID ${item.productId} not found`);
        }
        const stock = stockMap.get(item.productId);
        if (!stock) {
            throw AppError_1.default.notFound(`Stock not available for product ${item.productId}`);
        }
        const expectedRate = Number(stock.saleRate ?? stock.mrpRate ?? 0);
        const isProd = config_1.default.env === "production";
        if (Math.abs(item.rate - expectedRate) > 0.01) {
            if (isProd) {
                throw AppError_1.default.badRequest(`Price mismatch for product ${item.productId}. Expected ${expectedRate}, got ${item.rate}`);
            }
            console.warn(`[DEV] Price mismatch allowed for product ${item.productId}`);
        }
        const expectedNetAmount = item.qnty * item.rate;
        if (Math.abs(item.net_amount - expectedNetAmount) > 0.01) {
            throw AppError_1.default.badRequest(`Net amount mismatch for product ${item.productId}`);
        }
        calculatedSubtotal += item.net_amount;
    }
    const tax = Number(data.tax_amount_b_coins ?? 0);
    const delivery = Number(data.del_charge_amount ?? 0);
    const discount = Number(data.discounted_amount ?? 0);
    const expectedTotal = calculatedSubtotal + tax + delivery - discount;
    if (Math.abs(Number(data.total_amount) - expectedTotal) > 0.1) {
        throw AppError_1.default.badRequest(`Total mismatch. Expected ${expectedTotal}, got ${data.total_amount}`);
    }
    const order = await orderRepo.createOrder(data);
    if (!order) {
        throw AppError_1.default.internal("Order creation failed");
    }
    // Reuse the already-enriched order from repository to avoid duplicate fetch.
    const num_items = order?.orderDetails?.reduce((sum, item) => sum + Number(item.qnty || 0), 0) ?? 0;
    const enrichedOrder = {
        ...order,
        num_items,
        subtotal: calculatedSubtotal,
        total_amount: order?.total_amount,
        tax_amount: order?.tax_amount_b_coins,
        discount: order?.discounted_amount,
        payment_method: order?.net_amount_payment_mode,
    };
    return (0, utils_1.formatDecimal)({
        message: "Order Created Successfully",
        order_id: order.order_id,
        order: enrichedOrder,
    });
};
exports.createOrderUseCase = createOrderUseCase;
