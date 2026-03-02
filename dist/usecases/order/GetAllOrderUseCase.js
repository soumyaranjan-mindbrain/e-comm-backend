"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrdersUseCase = void 0;
const OrderRepository_1 = require("../../data/repositories/order/OrderRepository");
const utils_1 = require("../../utils");
const prisma_client_1 = __importDefault(require("../../prisma-client"));
const orderRepo = new OrderRepository_1.OrderRepository();
const getAllOrdersUseCase = async (params = {}) => {
    const { page = 1, limit = 50, status, comId } = params;
    const skip = (page - 1) * limit;
    // ✅ Build Filter
    const where = {};
    if (comId !== undefined) {
        where.comId = comId;
    }
    // If status is provided, we filter by the latest status in the status history
    // Actually, OrderRepository handles simple status if we use the master status field.
    // But let's use the UseCase logic for more control.
    if (status) {
        where.status = status; // Master status is updated in updateStatusByOrderId
    }
    // ✅ Total count for pagination metadata
    const total = await prisma_client_1.default.x8_app_orders_master.count({ where });
    // ✅ Fetch data through repository (already has include logic)
    const orders = await orderRepo.getAllOrders(params);
    return (0, utils_1.formatDecimal)({
        orders,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    });
};
exports.getAllOrdersUseCase = getAllOrdersUseCase;
//# sourceMappingURL=GetAllOrderUseCase.js.map