import { Response } from "express";
import { AuthRequest } from "../../middleware/authenticate-user";
import { CartRepository } from "../../data/repositories/cart/CartRepository";

const cartRepository = new CartRepository();

// ---------------- Add to Cart ----------------
export const addToCart = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const comId = req.user!.comId || req.user!.id; // Fallback to id if comId missing
    const productId = req.body.productId || req.body.ItemId;
    const quantity = req.body.quantity;

    if (productId === undefined || quantity === undefined) {
      res
        .status(400)
        .json({ success: false, message: "productId and quantity are required" });
      return;
    }

    const numProductId = Number(productId);
    const numQuantity = Number(quantity);

    if (isNaN(numProductId) || isNaN(numQuantity)) {
      res
        .status(400)
        .json({ success: false, message: "Valid productId and quantity are required" });
      return;
    }

    const result = await cartRepository.addToCart(
      comId,
      numProductId,
      numQuantity,
    );

    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Get Cart ----------------
export const getCart = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const comId = req.user!.comId || req.user!.id;
    const items = await cartRepository.getCartByComId(comId);

    let grandTotal = 0;
    const enrichedItems = items.map((item: any) => {
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Update Quantity ----------------
export const updateCartQuantity = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const comId = req.user!.comId || req.user!.id;
    const itemId = Number(req.params.itemId);
    const { quantity } = req.body;

    if (isNaN(itemId) || quantity === undefined) {
      res.status(400).json({
        success: false,
        message: "Valid itemId and quantity are required",
      });
      return;
    }

    const result = await cartRepository.updateQuantity(
      comId,
      itemId,
      Number(quantity),
    );

    res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Remove Item ----------------
export const removeFromCart = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const comId = req.user!.comId || req.user!.id;
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Clear Cart ----------------
export const clearCart = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const comId = req.user!.comId || req.user!.id;
    await cartRepository.clearCart(comId);
    res
      .status(200)
      .json({ success: true, message: "Cart cleared successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
