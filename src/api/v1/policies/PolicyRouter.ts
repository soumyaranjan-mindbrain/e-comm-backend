import { Router } from "express";
import { PolicyController } from "../../../controllers/content/PolicyController";

const router = Router();

// Public routes
router.get("/terms", PolicyController.getTerms);
router.get("/returns", PolicyController.getReturns);
router.get("/shipping", PolicyController.getShipping);

export default router;
