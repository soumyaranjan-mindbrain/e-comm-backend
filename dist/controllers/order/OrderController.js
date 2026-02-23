"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusController = exports.trackOrderController = exports.getOrderController = exports.cancelOrderController = exports.createOrderController = void 0;
const CreateOrderUseCase_1 = require("../../usecases/order/CreateOrderUseCase");
const CancelOrderUseCase_1 = require("../../usecases/order/CancelOrderUseCase");
const GetOrderUseCase_1 = require("../../usecases/order/GetOrderUseCase");
const TrackOrderUseCase_1 = require("../../usecases/order/TrackOrderUseCase");
const UpdateStatusUseCase_1 = require("../../usecases/order/UpdateStatusUseCase");
const OrderRepository_1 = require("../../data/repositories/order/OrderRepository");
// ==========================================
// CREATE ORDER
// ==========================================
/**
 * Create a new order
 */
const createOrderController = async (req, res) => {
    try {
        const orderData = req.body;
        const result = await (0, CreateOrderUseCase_1.createOrderUseCase)(orderData);
        res.status(201).json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Failed to create order" });
    }
};
exports.createOrderController = createOrderController;
// ==========================================
// CANCEL ORDER
// ==========================================
/**
 * Cancel an order
 */
const cancelOrderController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const updated_by = req.body.updated_by;
        const result = await (0, CancelOrderUseCase_1.cancelOrderUseCase)(orderId, updated_by);
        res.status(200).json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Failed to cancel order" });
    }
};
exports.cancelOrderController = cancelOrderController;
// ==========================================
// GET ORDER
// ==========================================
/**
 * Get order by ID
 */
const getOrderController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await (0, GetOrderUseCase_1.getOrderUseCase)(orderId);
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        res.status(200).json(order);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Failed to fetch order" });
    }
};
exports.getOrderController = getOrderController;
// ==========================================
// TRACK ORDER
// ==========================================
/**
 * Track order (history)
 */
const trackOrderController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const history = await (0, TrackOrderUseCase_1.trackOrderUseCase)(orderId);
        res.status(200).json(history);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Failed to track order" });
    }
};
exports.trackOrderController = trackOrderController;
// ==========================================
// UPDATE STATUS
// ==========================================
/**
 * Update order status
 */
const updateOrderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, updated_by } = req.body;
        if (!Object.values(OrderRepository_1.OrderStatus).includes(status)) {
            res.status(400).json({ message: "Invalid order status" });
            return;
        }
        const result = await (0, UpdateStatusUseCase_1.updateOrderStatusUseCase)(orderId, status, updated_by);
        res.status(200).json(result);
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ message: err.message || "Failed to update order status" });
    }
};
exports.updateOrderStatusController = updateOrderStatusController;
//# sourceMappingURL=OrderController.js.map