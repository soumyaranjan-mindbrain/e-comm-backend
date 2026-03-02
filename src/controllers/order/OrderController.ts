import { Request, Response } from "express";
import { createOrderUseCase } from "../../usecases/order/CreateOrderUseCase";
import { cancelOrderUseCase } from "../../usecases/order/CancelOrderUseCase";
import { getOrderUseCase } from "../../usecases/order/GetOrderUseCase";
import { getAllOrdersUseCase } from "../../usecases/order/GetAllOrderUseCase";
import { trackOrderUseCase } from "../../usecases/order/TrackOrderUseCase";
import { updateOrderStatusUseCase } from "../../usecases/order/UpdateStatusUseCase";
import { OrderStatus } from "../../data/repositories/order/OrderRepository";

// ==========================================
// CREATE ORDER
// ==========================================
/**
 * Create a new order
 */
export const createOrderController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user || user.comId === undefined) {
      res.status(401).json({ success: false, message: "Authentication required or missing comId" });
      return;
    }

    const orderData = {
      ...req.body,
      comId: user.comId
    };

    const result = await createOrderUseCase(orderData);
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: result
    });
  } catch (err: any) {
    console.error(err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to create order"
    });
  }
};

// ==========================================
// CANCEL ORDER
// ==========================================
/**
 * Cancel an order
 */
export const cancelOrderController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { updated_by, cancel_reason, cancelled_by_type } = req.body;

    const result = await cancelOrderUseCase(orderId, {
      updated_by,
      cancel_reason,
      cancelled_by_type
    });

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: result
    });
  } catch (err: any) {
    console.error(err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to cancel order"
    });
  }
};

// ==========================================
// GET ORDER
// ==========================================
/**
 * Get order by ID
 */
export const getOrderController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const order = await getOrderUseCase(orderId);
    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order
    });
  } catch (err: any) {
    console.error(err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to fetch order"
    });
  }
};

// ==========================================
// GET ALL ORDERS
// ==========================================
/**
 * Get all orders (optionally with pagination)
 */
export const getAllOrdersController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = (req as any).user;
    const { page, limit, status } = req.query;

    const result = await getAllOrdersUseCase({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status: status as string | undefined,
      comId: user?.comId,
    });

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: result,
    });
  } catch (err: any) {
    console.error(err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to fetch orders",
    });
  }
};

// ==========================================
// TRACK ORDER
// ==========================================
/**
 * Track order (history)
 */
export const trackOrderController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const history = await trackOrderUseCase(orderId);
    res.status(200).json({
      success: true,
      message: "Order tracking history fetched",
      data: history
    });
  } catch (err: any) {
    console.error(err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to track order"
    });
  }
};

// ==========================================
// UPDATE STATUS
// ==========================================
/**
 * Update order status
 */
export const updateOrderStatusController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status, updated_by } = req.body;

    if (!Object.values(OrderStatus).includes(status)) {
      res.status(400).json({ success: false, message: "Invalid order status" });
      return;
    }

    const result = await updateOrderStatusUseCase(orderId, status, updated_by);
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: result
    });
  } catch (err: any) {
    console.error(err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to update order status"
    });
  }
};
