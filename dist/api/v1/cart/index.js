"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_user_1 = __importDefault(require("../../../middleware/authenticate-user"));
const CartController_1 = require("../../../controllers/cart/CartController");
const router = (0, express_1.Router)();
// Add product to cart
router.post("/", authenticate_user_1.default, CartController_1.addToCart);
// Get cart items
router.get("/", authenticate_user_1.default, CartController_1.getCart);
// Update quantity by ItemId
router.put("/:itemId", authenticate_user_1.default, CartController_1.updateCartQuantity);
// Remove single product by ItemId
router.delete("/:itemId", authenticate_user_1.default, CartController_1.removeFromCart);
// Clear full cart
router.delete("/clear/all", authenticate_user_1.default, CartController_1.clearCart);
exports.default = router;
//# sourceMappingURL=index.js.map