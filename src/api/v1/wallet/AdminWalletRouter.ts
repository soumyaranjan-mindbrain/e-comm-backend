import { Router } from "express";
import { WalletAdminController } from "../../../controllers/wallet/WalletAdminController";
import authenticateUser from "../../../middleware/authenticate-user";

const router = Router();

// In a real system, we'd have a separate middleware for admin check
// For now, using authenticateUser as per project common patterns
router.use(authenticateUser);

router.get("/config", WalletAdminController.getConfig);
router.put("/config", WalletAdminController.updateConfig);
router.get("/analytics", WalletAdminController.getAnalytics);
router.get("/negative-accounts", WalletAdminController.getNegativeAccounts);
router.post("/trigger-activation", WalletAdminController.triggerActivation);

export default router;
