import { Router } from "express";
import { FaqController } from "../../../controllers/faq/FaqController";

const router = Router();

// Public routes
router.get("/", FaqController.getFaqs);
router.get("/categories", FaqController.getFaqCategories);

export default router;
