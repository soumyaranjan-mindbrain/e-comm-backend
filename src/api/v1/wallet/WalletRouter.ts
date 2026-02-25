import { Router } from "express";
import { WalletController } from "../../../controllers/wallet/WalletController";
import authenticateUser from "../../../middleware/authenticate-user";

const router = Router();

// All user wallet routes are protected
router.use(authenticateUser);

router.get("/", WalletController.getWalletBalance);
router.get("/transactions", WalletController.getTransactionHistory);
router.post("/validate", WalletController.validateRedemption);

export default router;
