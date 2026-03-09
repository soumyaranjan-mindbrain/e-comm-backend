import {
  OrderRepository,
  OrderInput,
} from "../../data/repositories/order/OrderRepository";

import AppError from "../../errors/AppError";
import { formatDecimal } from "../../utils";
import config from "../../config";

const orderRepo = new OrderRepository();

type ProductLookup = {
  productId?: number | null;
};

type StockLookup = {
  itemId?: number | null;
  saleRate?: number | null;
  mrpRate?: string | number | null;
};

/**
 * Create Order UseCase
 * Handles validation + calculation + transactional creation
 */
export const createOrderUseCase = async (data: OrderInput) => {
  if (!data.items || data.items.length === 0) {
    throw AppError.badRequest("Order must contain at least one item");
  }

  let calculatedSubtotal = 0;

  // Batch-fetch for all items to avoid per-item DB round trips.
  const uniqueProductIds = [...new Set(data.items.map((item) => item.productId))];
  const [products, stockItems] = await Promise.all([
    orderRepo.getProductsByIds(uniqueProductIds),
    orderRepo.getShopStockItemsByProductIds(uniqueProductIds),
  ]);

  const productMap = new Map<number, ProductLookup>();
  for (const product of products as ProductLookup[]) {
    if (product?.productId !== null && product?.productId !== undefined) {
      productMap.set(Number(product.productId), product);
    }
  }

  const stockMap = new Map<number, StockLookup>();
  for (const stock of stockItems as StockLookup[]) {
    if (
      stock?.itemId !== null &&
      stock?.itemId !== undefined &&
      !stockMap.has(Number(stock.itemId))
    ) {
      stockMap.set(Number(stock.itemId), stock);
    }
  }

  // Validate Items
  for (const item of data.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      throw AppError.notFound(`Product with ID ${item.productId} not found`);
    }

    const stock = stockMap.get(item.productId);
    if (!stock) {
      throw AppError.notFound(
        `Stock not available for product ${item.productId}`,
      );
    }

    const expectedRate = Number(stock.saleRate ?? stock.mrpRate ?? 0);
    const isProd = config.env === "production";

    if (Math.abs(item.rate - expectedRate) > 0.01) {
      if (isProd) {
        throw AppError.badRequest(
          `Price mismatch for product ${item.productId}. Expected ${expectedRate}, got ${item.rate}`,
        );
      }
      console.warn(`[DEV] Price mismatch allowed for product ${item.productId}`);
    }

    const expectedNetAmount = item.qnty * item.rate;
    if (Math.abs(item.net_amount - expectedNetAmount) > 0.01) {
      throw AppError.badRequest(
        `Net amount mismatch for product ${item.productId}`,
      );
    }

    calculatedSubtotal += item.net_amount;
  }

  const tax = Number(data.tax_amount_b_coins ?? 0);
  const delivery = Number(data.del_charge_amount ?? 0);
  const discount = Number(data.discounted_amount ?? 0);

  const expectedTotal = calculatedSubtotal + tax + delivery - discount;
  if (Math.abs(Number(data.total_amount) - expectedTotal) > 0.1) {
    throw AppError.badRequest(
      `Total mismatch. Expected ${expectedTotal}, got ${data.total_amount}`,
    );
  }

  const order = await orderRepo.createOrder(data);
  if (!order) {
    throw AppError.internal("Order creation failed");
  }

  // Reuse the already-enriched order from repository to avoid duplicate fetch.
  const num_items =
    order?.orderDetails?.reduce(
      (sum: number, item: { qnty?: number }) => sum + Number(item.qnty || 0),
      0,
    ) ?? 0;

  const enrichedOrder = {
    ...order,
    num_items,
    subtotal: calculatedSubtotal,
    total_amount: order?.total_amount,
    tax_amount: order?.tax_amount_b_coins,
    discount: order?.discounted_amount,
    payment_method: order?.net_amount_payment_mode,
  };

  return formatDecimal({
    message: "Order Created Successfully",
    order_id: order.order_id,
    order: enrichedOrder,
  });
};
