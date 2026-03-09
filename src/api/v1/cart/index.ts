import { Router } from "express";
import authenticateUser from "../../../middleware/authenticate-user";
import resolveCompanyContext from "../../../middleware/resolve-company-context";
import {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  getCart,
  clearCart,
} from "../../../controllers/cart/CartController";

const router = Router();
router.use(authenticateUser, resolveCompanyContext);

// Add product to cart
router.post("/", addToCart);

// Get cart items
router.get("/", getCart);

// Update quantity by ItemId
router.put("/:itemId", updateCartQuantity);

// Remove single product by ItemId
router.delete("/:itemId", removeFromCart);

// Clear full cart
router.delete("/clear/all", clearCart);

export default router;
