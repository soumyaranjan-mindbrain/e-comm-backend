"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletAdminController = void 0;
const WalletRepository_1 = require("../../data/repositories/wallet/WalletRepository");
const WalletService_1 = require("../../services/WalletService");
const repo = new WalletRepository_1.WalletRepository();
const service = new WalletService_1.WalletService();
class WalletAdminController {
    /**
     * GET /v1/admin/wallet/config
     */
    static async getConfig(req, res) {
        try {
            const config = await repo.getActiveConfig();
            res.status(200).json({ success: true, data: config });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    /**
     * PUT /v1/admin/wallet/config
     */
    static async updateConfig(req, res) {
        try {
            const { minEligibleAmount, maxEligibleAmount, rewardPercentMin, rewardPercentMax, maxCoinsPerOrder, redeemPercentLimit, returnPeriodDays, } = req.body;
            if (rewardPercentMax < rewardPercentMin) {
                res.status(400).json({ success: false, message: "Max percent cannot be less than min percent" });
                return;
            }
            const nextConfig = await repo.createConfig({
                minEligibleAmount: parseFloat(minEligibleAmount),
                maxEligibleAmount: parseFloat(maxEligibleAmount),
                rewardPercentMin: parseFloat(rewardPercentMin),
                rewardPercentMax: parseFloat(rewardPercentMax),
                maxCoinsPerOrder: parseInt(maxCoinsPerOrder),
                redeemPercentLimit: parseFloat(redeemPercentLimit),
                returnPeriodDays: parseInt(returnPeriodDays),
            });
            res.status(200).json({ success: true, message: "Config updated to new version", data: nextConfig });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    /**
     * GET /v1/admin/wallet/analytics
     */
    static async getAnalytics(req, res) {
        try {
            const metrics = await repo.getLiabilityMetrics();
            res.status(200).json({ success: true, data: metrics });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    /**
     * GET /v1/admin/wallet/negative-accounts
     */
    static async getNegativeAccounts(req, res) {
        try {
            const accounts = await repo.getNegativeAccounts();
            res.status(200).json({ success: true, data: accounts });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    /**
     * POST /v1/admin/wallet/trigger-activation
     */
    static async triggerActivation(req, res) {
        try {
            const count = await service.activatePendingCoins();
            res.status(200).json({ success: true, message: `Processed ${count} activations` });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.WalletAdminController = WalletAdminController;
//# sourceMappingURL=WalletAdminController.js.map