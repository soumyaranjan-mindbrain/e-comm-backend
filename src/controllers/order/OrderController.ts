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
      message: "order placed successfully",
      data: result
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "failed to create order" });
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
    const updated_by = req.body.updated_by;
    const result = await cancelOrderUseCase(orderId, updated_by);
    res.status(200).json({
      success: true,
      message: "order cancelled successfully",
      data: result
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "failed to cancel order" });
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
      res.status(404).json({ success: false, message: "order not found" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "order fetched successfully",
      data: order
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "failed to fetch order" });
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
    const { page = 1, limit = 50, status } = req.query;

    const result = await getAllOrdersUseCase({
      page: Number(page),
      limit: Number(limit),
      status: status as string | undefined,
      comId: user?.comId,
    });

    res.status(200).json({
      success: true,
      message: "orders fetched successfully",
      data: result,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message || "failed to fetch orders",
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
      message: "order tracking history fetched",
      data: history
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "failed to track order" });
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
      res.status(400).json({ success: false, message: "invalid order status" });
      return;
    }

    const result = await updateOrderStatusUseCase(orderId, status, updated_by);
    res.status(200).json({
      success: true,
      message: "order status updated successfully",
      data: result
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "failed to update order status" });
  }
};
