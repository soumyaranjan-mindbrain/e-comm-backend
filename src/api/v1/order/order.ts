import { Router } from "express";
import {
  createOrderController,
  getOrderController,
  updateOrderStatusController,
  trackOrderController,
  cancelOrderController,
} from "../../../controllers/order/OrderController";

const router = Router();

router.post("/", createOrderController);
router.get("/:orderId", getOrderController);
router.patch("/:orderId/status", updateOrderStatusController);
router.get("/:orderId/track", trackOrderController);
router.patch("/:orderId/cancel", cancelOrderController);

export default router;
