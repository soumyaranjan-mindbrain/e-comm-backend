"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const WalletController_1 = require("../../../controllers/wallet/WalletController");
const authenticate_user_1 = __importDefault(require("../../../middleware/authenticate-user"));
const router = (0, express_1.Router)();
// All user wallet routes are protected
router.use(authenticate_user_1.default);
router.get("/balance", WalletController_1.WalletController.getWalletBalance);
router.get("/history", WalletController_1.WalletController.getTransactionHistory);
router.get("/config", WalletController_1.WalletController.getWalletConfig);
router.post("/validate-redeem", WalletController_1.WalletController.validateRedemption);
exports.default = router;
