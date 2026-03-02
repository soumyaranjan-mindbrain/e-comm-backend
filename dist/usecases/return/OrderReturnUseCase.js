"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReturnByIdUseCase = exports.updateReturnStatusUseCase = exports.getAllReturnsUseCase = exports.createReturnUseCase = void 0;
const OrderReturnRepository_1 = require("../../data/repositories/return/OrderReturnRepository");
const WalletService_1 = require("../../services/WalletService");
const repo = new OrderReturnRepository_1.OrderReturnRepository();
const walletService = new WalletService_1.WalletService();
const createReturnUseCase = async (data) => {
    const result = await repo.createReturn(data);
    // COIN LOGIC: Reversal on return
    try {
        if (data.orderId && data.comId) {
            await walletService.handleReturn(data.orderId, data.comId, data.refundAmount || 0);
        }
    }
    catch (err) {
        console.error("Error reversing coins on return:", err);
    }
    return result;
};
exports.createReturnUseCase = createReturnUseCase;
const getAllReturnsUseCase = async () => {
    return repo.getAllReturns();
};
exports.getAllReturnsUseCase = getAllReturnsUseCase;
const updateReturnStatusUseCase = async (returnId, status) => {
    if (!["APPROVED", "REJECTED"].includes(status)) {
        throw new Error("Invalid status value");
    }
    return repo.updateReturnStatus(returnId, status);
};
exports.updateReturnStatusUseCase = updateReturnStatusUseCase;
const getReturnByIdUseCase = async (returnId) => {
    return repo.getReturnById(returnId);
};
exports.getReturnByIdUseCase = getReturnByIdUseCase;
//# sourceMappingURL=OrderReturnUseCase.js.map