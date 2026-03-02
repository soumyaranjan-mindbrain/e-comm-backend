import { Router } from "express";
import {
  createOrderController,
  getAllOrdersController,
  getOrderController,
  updateOrderStatusController,
  trackOrderController,
  cancelOrderController,
} from "../../../controllers/order/OrderController";

import authenticateUser from "../../../middleware/authenticate-user";
import validateRequest from "../../../middleware/validate-request";
import { createOrderSchema, cancelOrderSchema } from "./validation";

const router = Router();

router.use(authenticateUser);

router.post("/", validateRequest(createOrderSchema), createOrderController);
router.get("/", getAllOrdersController);
router.get("/:orderId", getOrderController);
router.patch("/:orderId/status", updateOrderStatusController);
router.get("/:orderId/track", trackOrderController);
router.patch(
  "/:orderId/cancel",
  validateRequest(cancelOrderSchema),
  cancelOrderController,
);

export default router;
