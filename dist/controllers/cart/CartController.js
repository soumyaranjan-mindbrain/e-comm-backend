"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.updateCartQuantity = exports.getCart = exports.addToCart = void 0;
const CartRepository_1 = require("../../data/repositories/cart/CartRepository");
const cartRepository = new CartRepository_1.CartRepository();
// ---------------- Add to Cart ----------------
const addToCart = async (req, res) => {
    try {
        const comId = req.user.id;
        const { ItemId, quantity } = req.body;
        if (ItemId === undefined || quantity === undefined) {
            res
                .status(400)
                .json({ success: false, message: "ItemId and quantity are required" });
            return;
        }
        const result = await cartRepository.addToCart(comId, Number(ItemId), Number(quantity));
        res.status(200).json({
            success: true,
            message: "Item added to cart successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.addToCart = addToCart;
// ---------------- Get Cart ----------------
const getCart = async (req, res) => {
    try {
        const comId = req.user.id;
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
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCart = getCart;
// ---------------- Update Quantity ----------------
const updateCartQuantity = async (req, res) => {
    try {
        const comId = req.user.id;
        const itemId = Number(req.params.itemId);
        const { quantity } = req.body;
        if (isNaN(itemId) || quantity === undefined) {
            res.status(400).json({
                success: false,
                message: "Valid itemId and quantity are required",
            });
            return;
        }
        const result = await cartRepository.updateQuantity(comId, itemId, Number(quantity));
        res.status(200).json({
            success: true,
            message: "Cart quantity updated successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateCartQuantity = updateCartQuantity;
// ---------------- Remove Item ----------------
const removeFromCart = async (req, res) => {
    try {
        const comId = req.user.id;
        const itemId = Number(req.params.itemId);
        if (isNaN(itemId)) {
            res
                .status(400)
                .json({ success: false, message: "Valid itemId is required" });
            return;
        }
        await cartRepository.removeCartItem(comId, itemId);
        res.status(200).json({
            success: true,
            message: "Item removed from cart successfully",
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.removeFromCart = removeFromCart;
// ---------------- Clear Cart ----------------
const clearCart = async (req, res) => {
    try {
        const comId = req.user.id;
        await cartRepository.clearCart(comId);
        res
            .status(200)
            .json({ success: true, message: "Cart cleared successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.clearCart = clearCart;
