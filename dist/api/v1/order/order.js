"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderController_1 = require("../../../controllers/order/OrderController");
const authenticate_user_1 = __importDefault(require("../../../middleware/authenticate-user"));
const validate_request_1 = __importDefault(require("../../../middleware/validate-request"));
const validation_1 = require("./validation");
const router = (0, express_1.Router)();
router.use(authenticate_user_1.default);
router.post("/", (0, validate_request_1.default)(validation_1.createOrderSchema), OrderController_1.createOrderController);
router.get("/", OrderController_1.getAllOrdersController);
router.get("/:orderId", OrderController_1.getOrderController);
router.patch("/:orderId/status", OrderController_1.updateOrderStatusController);
router.get("/:orderId/track", OrderController_1.trackOrderController);
router.patch("/:orderId/cancel", (0, validate_request_1.default)(validation_1.cancelOrderSchema), OrderController_1.cancelOrderController);
exports.default = router;
