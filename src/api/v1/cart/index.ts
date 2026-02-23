import { Router } from "express";
import authenticateUser from "../../../middleware/authenticate-user";
import {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  getCart,
  clearCart,
} from "../../../controllers/cart/CartController";

const router = Router();

// Add product to cart
router.post("/", authenticateUser, addToCart);

// Get cart items
router.get("/", authenticateUser, getCart);

// Update quantity by ItemId
router.put("/:itemId", authenticateUser, updateCartQuantity);

// Remove single product by ItemId
router.delete("/:itemId", authenticateUser, removeFromCart);

// Clear full cart
router.delete("/clear/all", authenticateUser, clearCart);

export default router;
