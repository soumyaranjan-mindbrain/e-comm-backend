import { Router } from "express";
import { ContactController } from "../../../controllers/content/ContactController";

const router = Router();

// Public routes
router.get("/info", ContactController.getInfo);
router.post("/enquiry", ContactController.submitEnquiry);

export default router;
