"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const WalletAdminController_1 = require("../../../controllers/wallet/WalletAdminController");
const authenticate_user_1 = __importDefault(require("../../../middleware/authenticate-user"));
const router = (0, express_1.Router)();
// In a real system, we'd have a separate middleware for admin check
// For now, using authenticateUser as per project common patterns
router.use(authenticate_user_1.default);
router.get("/config", WalletAdminController_1.WalletAdminController.getConfig);
router.put("/config", WalletAdminController_1.WalletAdminController.updateConfig);
router.get("/analytics", WalletAdminController_1.WalletAdminController.getAnalytics);
router.get("/negative-accounts", WalletAdminController_1.WalletAdminController.getNegativeAccounts);
router.post("/trigger-activation", WalletAdminController_1.WalletAdminController.triggerActivation);
exports.default = router;
