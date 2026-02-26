"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.updateCartQuantity = exports.getCart = exports.addToCart = void 0;
const CartRepository_1 = require("../../data/repositories/cart/CartRepository");
const cartRepository = new CartRepository_1.CartRepository();
// ---------------- Add to Cart ----------------
const addToCart = async (req, res, next) => {
    try {
        const comId = req.user.comId || req.user.id;
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
        const comId = req.user.comId || req.user.id;
        const items = await cartRepository.getCartByComId(comId);
        let grandTotal = 0;
        const enrichedItems = items.map((item) => {
            const price = item.product?.stockItems?.[0]?.saleRate || 0;
            const itemTotal = price * item.quantity;
            grandTotal += itemTotal;
            return {
                cartId: item.cartId,
                productId: item.ItemId,
                productName: item.product?.productName,
                productImage: item.product?.proimg,
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
        const comId = req.user.comId || req.user.id;
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
        const comId = req.user.comId || req.user.id;
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
        const comId = req.user.comId || req.user.id;
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
