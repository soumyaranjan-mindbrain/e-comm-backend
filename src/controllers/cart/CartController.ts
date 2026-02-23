import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/authenticate-user";
import { CartRepository } from "../../data/repositories/cart/CartRepository";

const cartRepository = new CartRepository();

// ---------------- Add to Cart ----------------
export const addToCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const comId = req.user!.comId || req.user!.id;
    const productId = req.body.productId || req.body.ItemId;
    const quantity = req.body.quantity;

    if (productId === undefined || quantity === undefined) {
      res.status(400).json({
        success: false,
        msg: "productId and quantity are required",
      });
      return;
    }

    const numProductId = Number(productId);
    const numQuantity = Number(quantity);

    if (isNaN(numProductId) || isNaN(numQuantity) || numQuantity < 1) {
      res.status(400).json({
        success: false,
        msg: "valid productId and quantity (min 1) are required",
      });
      return;
    }

    const result = await cartRepository.addToCart(comId, numProductId, numQuantity);

    res.status(200).json({
      success: true,
      msg: "item added to cart successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- Get Cart ----------------
export const getCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
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
  } catch (error) {
    next(error);
  }
};

// ---------------- Update Quantity ----------------
export const updateCartQuantity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const comId = req.user!.comId || req.user!.id;
    const itemId = Number(req.params.itemId);
    const { quantity } = req.body;

    if (isNaN(itemId)) {
      res.status(400).json({
        success: false,
        msg: "valid itemId is required",
      });
      return;
    }

    if (quantity === undefined || isNaN(Number(quantity)) || Number(quantity) < 1) {
      res.status(400).json({
        success: false,
        msg: "valid quantity (min 1) is required",
      });
      return;
    }

    const result = await cartRepository.updateQuantity(comId, itemId, Number(quantity));

    res.status(200).json({
      success: true,
      msg: "cart quantity updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- Remove Item ----------------
export const removeFromCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const comId = req.user!.comId || req.user!.id;
    const itemId = Number(req.params.itemId);

    if (isNaN(itemId)) {
      res.status(400).json({
        success: false,
        msg: "valid itemId is required",
      });
      return;
    }

    await cartRepository.removeCartItem(comId, itemId);

    res.status(200).json({
      success: true,
      msg: "item removed from cart successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- Clear Cart ----------------
export const clearCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const comId = req.user!.comId || req.user!.id;
    await cartRepository.clearCart(comId);

    res.status(200).json({
      success: true,
      msg: "cart cleared successfully",
    });
  } catch (error) {
    next(error);
  }
};
