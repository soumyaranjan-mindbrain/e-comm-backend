import { Router } from "express";
import { WalletController } from "../../../controllers/wallet/WalletController";
import authenticateUser from "../../../middleware/authenticate-user";

const router = Router();

// All user wallet routes are protected
router.use(authenticateUser);

router.get("/balance", WalletController.getWalletBalance);
router.get("/history", WalletController.getTransactionHistory);
router.get("/config", WalletController.getWalletConfig);
router.post("/validate-redeem", WalletController.validateRedemption);

export default router;
