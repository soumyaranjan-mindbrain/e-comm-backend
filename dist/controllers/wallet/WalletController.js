"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const WalletRepository_1 = require("../../data/repositories/wallet/WalletRepository");
const repo = new WalletRepository_1.WalletRepository();
class WalletController {
    /**
     * GET /v1/wallet
     */
    static async getWalletBalance(req, res) {
        try {
            const userId = req.user.comId || req.user.id; // Fallback to id if comId missing
            const balances = await repo.getUserBalances(userId);
            res.status(200).json({
                success: true,
                data: {
                    coinBalance: balances?.coinBalance || 0,
                    pendingCoinBalance: balances?.pendingCoinBalance || 0,
                }
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    /**
     * GET /v1/wallet/transactions
     */
    static async getTransactionHistory(req, res) {
        try {
            const userId = req.user.comId || req.user.id;
            const skip = parseInt(req.query.skip) || 0;
            const take = parseInt(req.query.take) || 20;
            const transactions = await repo.getTransactionsByUser(userId, skip, take);
            res.status(200).json({
                success: true,
                data: transactions
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    /**
     * POST /v1/wallet/validate
     */
    static async validateRedemption(req, res) {
        try {
            const userId = req.user.comId || req.user.id;
            const { cartTotal } = req.body;
            if (!cartTotal || isNaN(cartTotal)) {
                res.status(400).json({ success: false, message: "Valid cartTotal is required" });
                return;
            }
            const config = await repo.getActiveConfig();
            const balances = await repo.getUserBalances(userId);
            if (!config) {
                res.status(200).json({
                    success: true,
                    data: { applicableCoins: 0, currentBalance: balances?.coinBalance || 0 }
                });
                return;
            }
            const maxRedeemable = cartTotal * (config.redeemPercentLimit / 100);
            const applicableCoins = Math.min(balances?.coinBalance || 0, maxRedeemable);
            res.status(200).json({
                success: true,
                data: {
                    applicableCoins: Math.floor(applicableCoins),
                    currentBalance: balances?.coinBalance || 0,
                    isNegative: (balances?.coinBalance || 0) < 0
                }
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.WalletController = WalletController;
//# sourceMappingURL=WalletController.js.map