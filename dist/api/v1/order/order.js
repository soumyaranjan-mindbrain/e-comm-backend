"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderController_1 = require("../../../controllers/order/OrderController");
const router = (0, express_1.Router)();
router.post("/", OrderController_1.createOrderController);
router.get("/:orderId", OrderController_1.getOrderController);
router.patch("/:orderId/status", OrderController_1.updateOrderStatusController);
router.get("/:orderId/track", OrderController_1.trackOrderController);
router.patch("/:orderId/cancel", OrderController_1.cancelOrderController);
exports.default = router;
//# sourceMappingURL=order.js.map