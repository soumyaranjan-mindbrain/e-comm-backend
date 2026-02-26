"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderReturnRepository = void 0;
const prisma_client_1 = __importDefault(require("../../../prisma-client"));
class OrderReturnRepository {
    // Create a new return request
    async createReturn(data) {
        // Convert pickupDate to Date object if it's a string
        const pickupDateObj = typeof data.pickupDate === "string"
            ? new Date(data.pickupDate)
            : data.pickupDate;
        return prisma_client_1.default.orderReturn.create({
            data: {
                orderId: data.orderId,
                productId: data.productId,
                comId: data.comId, // Required field
                returnReason: data.returnReason,
                pickupDate: pickupDateObj,
                refundAmount: data.refundAmount,
            },
        });
    }
    // Get all return requests, newest first
    async getAllReturns() {
        return prisma_client_1.default.orderReturn.findMany({
            orderBy: { createdAt: "desc" }, // Use model field, NOT DB column
        });
    }
    // Get a return request by ID
    async getReturnById(returnId) {
        return prisma_client_1.default.orderReturn.findUnique({
            where: { id: returnId },
        });
    }
    // Update return request status
    async updateReturnStatus(returnId, status) {
        const existing = await prisma_client_1.default.orderReturn.findUnique({
            where: { id: returnId },
        });
        if (!existing)
            throw new Error(`Return with id ${returnId} not found`);
        return prisma_client_1.default.orderReturn.update({
            where: { id: returnId },
            data: { status },
        });
    }
}
exports.OrderReturnRepository = OrderReturnRepository;
