"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderController_1 = require("../../../controllers/order/OrderController");
const authenticate_user_1 = __importDefault(require("../../../middleware/authenticate-user"));
const router = (0, express_1.Router)();
router.use(authenticate_user_1.default);
router.post("/", OrderController_1.createOrderController);
router.get("/", OrderController_1.getAllOrdersController);
router.get("/:orderId", OrderController_1.getOrderController);
router.patch("/:orderId/status", OrderController_1.updateOrderStatusController);
router.get("/:orderId/track", OrderController_1.trackOrderController);
router.patch("/:orderId/cancel", OrderController_1.cancelOrderController);
exports.default = router;
