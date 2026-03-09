"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusController = exports.trackOrderController = exports.getAllOrdersController = exports.getOrderController = exports.cancelOrderController = exports.createOrderController = void 0;
const CreateOrderUseCase_1 = require("../../usecases/order/CreateOrderUseCase");
const CancelOrderUseCase_1 = require("../../usecases/order/CancelOrderUseCase");
const GetOrderUseCase_1 = require("../../usecases/order/GetOrderUseCase");
const GetAllOrderUseCase_1 = require("../../usecases/order/GetAllOrderUseCase");
const TrackOrderUseCase_1 = require("../../usecases/order/TrackOrderUseCase");
const UpdateStatusUseCase_1 = require("../../usecases/order/UpdateStatusUseCase");
const OrderRepository_1 = require("../../data/repositories/order/OrderRepository");
// ==========================================
// CREATE ORDER
// ==========================================
const createOrderController = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user || user.comId === undefined) {
            res.status(401).json({
                success: false,
                msg: "Authentication required or missing comId",
            });
            return;
        }
        const orderData = {
            ...req.body,
            comId: user.comId,
        };
        const result = await (0, CreateOrderUseCase_1.createOrderUseCase)(orderData);
        res.status(201).json({
            success: true,
            msg: "order placed successfully",
            data: result,
        });
    }
    catch (err) {
        console.error("Error creating order:", err.message);
        next(err);
    }
};
exports.createOrderController = createOrderController;
// ==========================================
// CANCEL ORDER
// ==========================================
const cancelOrderController = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { updated_by, cancel_reason, cancelled_by_type } = req.body;
        const result = await (0, CancelOrderUseCase_1.cancelOrderUseCase)(orderId, {
            updated_by: updated_by ? Number(updated_by) : undefined,
            cancel_reason,
            cancelled_by_type,
        });
        res.status(200).json({
            success: true,
            msg: "order cancelled successfully",
            data: result,
        });
    }
    catch (err) {
        console.error("Error cancelling order:", err.message);
        next(err);
    }
};
exports.cancelOrderController = cancelOrderController;
// ==========================================
// GET ORDER
// ==========================================
const getOrderController = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await (0, GetOrderUseCase_1.getOrderUseCase)(orderId);
        if (!order) {
            res.status(404).json({ success: false, msg: "order not found" });
            return;
        }
        res.status(200).json({
            success: true,
            msg: "order fetched successfully",
            data: order,
        });
    }
    catch (err) {
        console.error("Error fetching order:", err.message);
        next(err);
    }
};
exports.getOrderController = getOrderController;
// ==========================================
// GET ALL ORDERS
// ==========================================
const getAllOrdersController = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user || user.comId === undefined) {
            res.status(401).json({
                success: false,
                msg: "Authentication required or missing comId",
            });
            return;
        }
        const { page, limit, status } = req.query;
        const result = await (0, GetAllOrderUseCase_1.getAllOrdersUseCase)({
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            status: status,
            comId: user.comId,
        });
        res.status(200).json({
            success: true,
            msg: "orders fetched successfully",
            data: result.data,
            pagination: result.pagination,
        });
    }
    catch (err) {
        console.error("Error fetching orders:", err.message);
        next(err);
    }
};
exports.getAllOrdersController = getAllOrdersController;
// ==========================================
// TRACK ORDER
// ==========================================
const trackOrderController = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const history = await (0, TrackOrderUseCase_1.trackOrderUseCase)(orderId);
        res.status(200).json({
            success: true,
            msg: "order tracking history fetched",
            data: history,
        });
    }
    catch (err) {
        console.error("Error tracking order:", err.message);
        next(err);
    }
};
exports.trackOrderController = trackOrderController;
// ==========================================
// UPDATE STATUS
// ==========================================
const updateOrderStatusController = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { status, updated_by, ...rest } = req.body;
        if (!Object.values(OrderRepository_1.OrderStatus).includes(status)) {
            res.status(400).json({ success: false, msg: "invalid order status" });
            return;
        }
        const result = await (0, UpdateStatusUseCase_1.updateOrderStatusUseCase)(orderId, status, updated_by, rest);
        res.status(200).json({
            success: true,
            msg: "order status updated successfully",
            data: result,
        });
    }
    catch (err) {
        console.error("Error updating order status:", err.message);
        next(err);
    }
};
exports.updateOrderStatusController = updateOrderStatusController;
