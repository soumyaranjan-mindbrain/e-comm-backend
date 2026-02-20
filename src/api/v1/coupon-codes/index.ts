import express from "express";
import * as couponCodeController from "../../../controllers/coupon-codes/CouponCodeController";
import validateRequest from "../../../middleware/validate-request";
import {
  createCouponCodeSchema,
  updateCouponCodeSchema,
} from "../../../data/request-schemas";

const router = express.Router();

// Search coupon codes by name: GET /coupon-codes/search?q=term&limit=50
router.get("/search", couponCodeController.search);

// Get all coupon codes (optional: ?limit=20, ?cursor=id)
router.get("/", couponCodeController.getAll);

// Get coupon code by ID
router.get("/:id", couponCodeController.getOne);

// Create a new coupon code
router.post(
  "/",
  validateRequest(createCouponCodeSchema),
  couponCodeController.create,
);

// Update a coupon code
router.put(
  "/:id",
  validateRequest(updateCouponCodeSchema),
  couponCodeController.update,
);

// Delete a coupon code
router.delete("/:id", couponCodeController.remove);

export default router;
