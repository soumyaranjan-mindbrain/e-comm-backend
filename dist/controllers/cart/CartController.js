"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.updateCartQuantity = exports.getCart = exports.addToCart = void 0;
const CartRepository_1 = require("../../data/repositories/cart/CartRepository");
const prisma_client_1 = __importDefault(require("../../prisma-client"));
const product_image_1 = require("../../utils/product-image");
const cartRepository = new CartRepository_1.CartRepository();
// ---------------- Add to Cart ----------------
const addToCart = async (req, res, next) => {
    try {
        // Ensure we use comId (business ID) for the cart, not the internal id
        let comId = req.user.comId;
        if (!comId) {
            console.log(`WARNING: comId missing in token for user ${req.user.id}. Falling back to db lookup.`);
            // This is a safety fallback in case token is misconfigured
            const customer = await prisma_client_1.default.customer.findUnique({ where: { id: req.user.id } });
            comId = customer?.comId || req.user.id;
        }
        if (!comId) {
            res.status(500).json({ success: false, message: "user identity could not be verified" });
            return;
        }
        const productId = req.body.productId || req.body.ItemId;
        const quantity = req.body.quantity;
        if (productId === undefined || quantity === undefined) {
            res.status(400).json({
                success: false,
                message: "productId and quantity are required",
            });
            return;
        }
        const numProductId = Number(productId);
        const numQuantity = Number(quantity);
        if (isNaN(numProductId) || isNaN(numQuantity) || numQuantity < 1) {
            res.status(400).json({
                success: false,
                message: "valid productId and quantity (min 1) are required",
            });
            return;
        }
        const result = await cartRepository.addToCart(comId, numProductId, numQuantity);
        res.status(200).json({
            success: true,
            message: "item added to cart successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.addToCart = addToCart;
// ---------------- Get Cart ----------------
const getCart = async (req, res, next) => {
    try {
        let comId = req.user.comId;
        if (!comId) {
            const customer = await prisma_client_1.default.customer.findUnique({ where: { id: req.user.id } });
            comId = customer?.comId || req.user.id;
        }
        if (!comId) {
            res.status(500).json({ success: false, message: "user identity could not be verified" });
            return;
        }
        const items = await cartRepository.getCartByComId(comId);
        let grandTotal = 0;
        const enrichedItems = items.map((item) => {
            const price = item.product?.stockItems?.[0]?.saleRate || 0;
            const itemTotal = price * item.quantity;
            const mainImage = (0, product_image_1.getProductMainImage)(item.product);
            grandTotal += itemTotal;
            return {
                cartId: item.cartId,
                productId: item.ItemId,
                productName: item.product?.productName,
                productImage: mainImage,
                image: mainImage,
                quantity: item.quantity,
                price: price,
                itemTotal: Number(itemTotal.toFixed(2)),
            };
        });
        res.status(200).json({
            success: true,
            count: enrichedItems.length,
            data: {
                items: enrichedItems,
                grandTotal: Number(grandTotal.toFixed(2)),
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCart = getCart;
// ---------------- Update Quantity ----------------
const updateCartQuantity = async (req, res, next) => {
    try {
        let comId = req.user.comId;
        if (!comId) {
            const customer = await prisma_client_1.default.customer.findUnique({ where: { id: req.user.id } });
            comId = customer?.comId || req.user.id;
        }
        if (!comId) {
            res.status(500).json({ success: false, message: "user identity could not be verified" });
            return;
        }
        const itemId = Number(req.params.itemId);
        const { quantity } = req.body;
        if (isNaN(itemId)) {
            res.status(400).json({
                success: false,
                message: "valid itemId is required",
            });
            return;
        }
        if (quantity === undefined || isNaN(Number(quantity)) || Number(quantity) < 1) {
            res.status(400).json({
                success: false,
                message: "valid quantity (min 1) is required",
            });
            return;
        }
        const result = await cartRepository.updateQuantity(comId, itemId, Number(quantity));
        res.status(200).json({
            success: true,
            message: "cart quantity updated successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCartQuantity = updateCartQuantity;
// ---------------- Remove Item ----------------
const removeFromCart = async (req, res, next) => {
    try {
        let comId = req.user.comId;
        if (!comId) {
            const customer = await prisma_client_1.default.customer.findUnique({ where: { id: req.user.id } });
            comId = customer?.comId || req.user.id;
        }
        if (!comId) {
            res.status(500).json({ success: false, message: "user identity could not be verified" });
            return;
        }
        const itemId = Number(req.params.itemId);
        if (isNaN(itemId)) {
            res.status(400).json({
                success: false,
                message: "valid itemId is required",
            });
            return;
        }
        await cartRepository.removeCartItem(comId, itemId);
        res.status(200).json({
            success: true,
            message: "item removed from cart successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.removeFromCart = removeFromCart;
// ---------------- Clear Cart ----------------
const clearCart = async (req, res, next) => {
    try {
        let comId = req.user.comId;
        if (!comId) {
            const customer = await prisma_client_1.default.customer.findUnique({ where: { id: req.user.id } });
            comId = customer?.comId || req.user.id;
        }
        if (!comId) {
            res.status(500).json({ success: false, message: "user identity could not be verified" });
            return;
        }
        await cartRepository.clearCart(comId);
        res.status(200).json({
            success: true,
            message: "cart cleared successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.clearCart = clearCart;
