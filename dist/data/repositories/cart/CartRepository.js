"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRepository = void 0;
const prisma_client_1 = __importDefault(require("../../../prisma-client"));
class CartRepository {
    // ---------------- Add to Cart ----------------
    async addToCart(comId, ItemId, quantity) {
        // Check if item already exists (even if soft deleted)
        const existing = await prisma_client_1.default.x5_app_cart.findUnique({
            where: {
                comId_ItemId: { comId, ItemId },
            },
        });
        const includeOptions = {
            product: {
                include: {
                    images: { select: { proimgs: true }, take: 1 },
                    stockItems: { where: { status: "ONE" }, take: 1 },
                },
            },
        };
        // If item exists and NOT deleted → increase quantity
        if (existing && existing.isDeleted === false) {
            return prisma_client_1.default.x5_app_cart.update({
                where: {
                    comId_ItemId: { comId, ItemId },
                },
                data: {
                    quantity: existing.quantity + quantity,
                },
                include: includeOptions,
            });
        }
        // If item exists but soft deleted → restore it and update quantity
        if (existing && existing.isDeleted === true) {
            return prisma_client_1.default.x5_app_cart.update({
                where: {
                    comId_ItemId: { comId, ItemId },
                },
                data: {
                    quantity,
                    isDeleted: false,
                },
                include: includeOptions,
            });
        }
        // If item does not exist → create new
        console.log(`DEBUG: Creating cart item for comId=${comId}, ItemId=${ItemId}`);
        return prisma_client_1.default.x5_app_cart.create({
            data: {
                comId,
                ItemId,
                quantity,
                isDeleted: false,
            },
            include: includeOptions,
        });
    }
    // ---------------- Get Cart ----------------
    async getCartByComId(comId) {
        return prisma_client_1.default.x5_app_cart.findMany({
            where: {
                comId,
                isDeleted: false,
            },
            include: {
                product: {
                    include: {
                        images: {
                            select: { proimgs: true },
                            take: 1,
                        },
                        stockItems: {
                            where: { status: "ONE" },
                            take: 1,
                        },
                    },
                },
            },
        });
    }
    // ---------------- Update Quantity ----------------
    async updateQuantity(comId, ItemId, quantity) {
        const existing = await prisma_client_1.default.x5_app_cart.findFirst({
            where: {
                comId,
                ItemId,
                isDeleted: false,
            },
        });
        if (!existing) {
            throw new Error("Cart item not found");
        }
        return prisma_client_1.default.x5_app_cart.update({
            where: {
                comId_ItemId: { comId, ItemId },
            },
            data: {
                quantity,
            },
            include: {
                product: {
                    include: {
                        images: { select: { proimgs: true }, take: 1 },
                        stockItems: { where: { status: "ONE" }, take: 1 },
                    },
                },
            },
        });
    }
    // ---------------- Soft Delete Single Item ----------------
    async removeCartItem(comId, ItemId) {
        return prisma_client_1.default.x5_app_cart.update({
            where: {
                comId_ItemId: { comId, ItemId },
            },
            data: {
                isDeleted: true,
            },
        });
    }
    // ---------------- Soft Delete All ----------------
    async clearCart(comId) {
        return prisma_client_1.default.x5_app_cart.updateMany({
            where: {
                comId,
                isDeleted: false,
            },
            data: {
                isDeleted: true,
            },
        });
    }
}
exports.CartRepository = CartRepository;
