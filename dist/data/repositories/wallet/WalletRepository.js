"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRepository = void 0;
const prisma_client_1 = __importDefault(require("../../../prisma-client"));
class WalletRepository {
    // --- CONFIG ---
    async getActiveConfig() {
        return prisma_client_1.default.coinConfig.findFirst({
            where: { isActive: true },
            orderBy: { versionNumber: "desc" },
        });
    }
    async createConfig(data) {
        return prisma_client_1.default.$transaction(async (tx) => {
            // Deactivate current active configs
            await tx.coinConfig.updateMany({
                where: { isActive: true },
                data: { isActive: false },
            });
            // Get latest version number
            const latest = await tx.coinConfig.findFirst({
                orderBy: { versionNumber: "desc" },
            });
            const nextVersion = (latest?.versionNumber || 0) + 1;
            return tx.coinConfig.create({
                data: {
                    ...data,
                    versionNumber: nextVersion,
                    isActive: true,
                },
            });
        });
    }
    // --- USER DATA ---
    async getUserBalances(userId, tx) {
        const client = tx || prisma_client_1.default;
        return client.customer.findUnique({
            where: { comId: userId },
            select: {
                coinBalance: true,
                pendingCoinBalance: true,
            },
        });
    }
    async getUserBalancesForUpdate(userId, tx) {
        // Note: raw query is used because Prisma doesn't support "FOR UPDATE" in findUnique directly in some versions
        await tx.$executeRaw `SELECT * FROM aa13_customer_db WHERE com_id = ${userId} FOR UPDATE`;
        return tx.customer.findUnique({
            where: { comId: userId },
            select: {
                id: true,
                comId: true,
                coinBalance: true,
                pendingCoinBalance: true,
            },
        });
    }
    // --- TRANSACTIONS ---
    async createTransaction(data, tx) {
        const client = tx || prisma_client_1.default;
        return client.coinTransaction.create({ data });
    }
    async getTransactionsByUser(userId, skip = 0, take = 20) {
        return prisma_client_1.default.coinTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            skip,
            take,
        });
    }
    async getTransactionByOrderAndType(orderId, type) {
        return prisma_client_1.default.coinTransaction.findFirst({
            where: { orderId, type },
        });
    }
    async updateTransactionStatus(id, status, processedAt, tx) {
        const client = tx || prisma_client_1.default;
        return client.coinTransaction.update({
            where: { id },
            data: { status, processedAt },
        });
    }
    async getPendingEligibleTransactions(batchSize) {
        return prisma_client_1.default.coinTransaction.findMany({
            where: {
                status: "PENDING",
                creditDate: { lte: new Date() },
            },
            take: batchSize,
            orderBy: { id: "asc" },
        });
    }
    // --- BALANCE UPDATES ---
    async updateBalances(userId, coinDelta, pendingDelta, tx) {
        return tx.customer.update({
            where: { comId: userId },
            data: {
                coinBalance: { increment: coinDelta },
                pendingCoinBalance: { increment: pendingDelta },
            },
        });
    }
    // --- ANALYTICS ---
    async getLiabilityMetrics() {
        const metrics = await prisma_client_1.default.customer.aggregate({
            _sum: {
                coinBalance: true,
                pendingCoinBalance: true,
            },
        });
        const redeemed = await prisma_client_1.default.coinTransaction.aggregate({
            where: { type: "REDEEM", status: "ACTIVE" },
            _sum: { amount: true },
        });
        const negativeDebt = await prisma_client_1.default.customer.aggregate({
            where: { coinBalance: { lt: 0 } },
            _sum: { coinBalance: true },
        });
        return {
            outstandingActiveCoins: metrics._sum.coinBalance || 0,
            totalPendingLiabilities: metrics._sum.pendingCoinBalance || 0,
            totalRedeemed: redeemed._sum.amount || 0,
            negativeDebt: Math.abs(negativeDebt._sum.coinBalance || 0),
        };
    }
    async getNegativeAccounts() {
        return prisma_client_1.default.customer.findMany({
            where: { coinBalance: { lt: 0 } },
            select: {
                id: true,
                comId: true,
                fullName: true,
                coinBalance: true,
            },
        });
    }
}
exports.WalletRepository = WalletRepository;
//# sourceMappingURL=WalletRepository.js.map