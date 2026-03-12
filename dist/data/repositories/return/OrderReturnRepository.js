"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderReturnRepository = void 0;
const prisma_client_1 = __importDefault(require("../../../prisma-client"));
const product_image_1 = require("../../../utils/product-image");
class OrderReturnRepository {
    async getProductMetaByIds(productIds) {
        const uniqueIds = Array.from(new Set(productIds.filter((id) => Number.isFinite(id))));
        if (uniqueIds.length === 0) {
            return new Map();
        }
        const products = await prisma_client_1.default.productRegister.findMany({
            where: {
                productId: {
                    in: uniqueIds,
                },
            },
            select: {
                productId: true,
                productName: true,
                proimg: true,
                images: {
                    select: { proimgs: true },
                    take: 1,
                },
            },
        });
        const productMap = new Map();
        for (const product of products) {
            if (!product.productId) {
                continue;
            }
            productMap.set(product.productId, {
                productName: product.productName || "",
                productImage: (0, product_image_1.getProductMainImage)(product) || "",
            });
        }
        return productMap;
    }
    async enrichReturnItem(item) {
        const productMap = await this.getProductMetaByIds([item.productId || 0]);
        const meta = productMap.get(item.productId || 0);
        return {
            ...item,
            productName: meta?.productName || "",
            productImage: meta?.productImage || "",
            image: meta?.productImage || "",
        };
    }
    async enrichReturnList(items) {
        const productMap = await this.getProductMetaByIds(items.map((item) => item.productId || 0));
        return items.map((item) => {
            const meta = productMap.get(item.productId || 0);
            return {
                ...item,
                productName: meta?.productName || "",
                productImage: meta?.productImage || "",
                image: meta?.productImage || "",
            };
        });
    }
    // Create a new return request
    async createReturn(data) {
        // Convert pickupDate to Date object if it's a string
        const pickupDateObj = typeof data.pickupDate === "string"
            ? new Date(data.pickupDate)
            : data.pickupDate;
        const created = await prisma_client_1.default.orderReturn.create({
            data: {
                orderId: data.orderId,
                productId: data.productId,
                comId: data.comId, // Required field
                returnReason: data.returnReason,
                pickupDate: pickupDateObj,
                refundAmount: data.refundAmount,
                status: "PENDING",
            },
        });
        return this.enrichReturnItem(created);
    }
    // Get all return requests, newest first
    async getAllReturns() {
        const returns = await prisma_client_1.default.orderReturn.findMany({
            orderBy: { createdAt: "desc" }, // Use model field, NOT DB column
        });
        return this.enrichReturnList(returns);
    }
    // Get a return request by ID
    async getReturnById(returnId) {
        const result = await prisma_client_1.default.orderReturn.findUnique({
            where: { id: returnId },
        });
        if (!result) {
            throw new Error(`Return with id ${returnId} not found`);
        }
        return this.enrichReturnItem(result);
    }
    // Update return request status
    async updateReturnStatus(returnId, status) {
        const existing = await prisma_client_1.default.orderReturn.findUnique({
            where: { id: returnId },
        });
        if (!existing)
            throw new Error(`Return with id ${returnId} not found`);
        const updated = await prisma_client_1.default.orderReturn.update({
            where: { id: returnId },
            data: { status },
        });
        return this.enrichReturnItem(updated);
    }
    // User cancels return request
    async cancelReturn(returnId) {
        const existing = await prisma_client_1.default.orderReturn.findUnique({
            where: { id: returnId },
        });
        if (!existing) {
            throw new Error(`Return with id ${returnId} not found`);
        }
        if (existing.status !== "PENDING") {
            throw new Error("Return request cannot be cancelled after approval or rejection");
        }
        const updated = await prisma_client_1.default.orderReturn.update({
            where: { id: returnId },
            data: { status: "CANCELLED" },
        });
        return this.enrichReturnItem(updated);
    }
}
exports.OrderReturnRepository = OrderReturnRepository;
