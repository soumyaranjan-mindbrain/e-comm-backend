import prisma from "../../../prisma-client";

export class CartRepository {
  // ---------------- Add to Cart ----------------
  async addToCart(comId: number, ItemId: number, quantity: number) {
    // Check if item already exists (even if soft deleted)
    const existing = await (prisma as any).x5_app_cart.findUnique({
      where: {
        comId_ItemId: { comId, ItemId },
      },
    });

    // If item exists and NOT deleted → increase quantity
    if (existing && (existing as any).isDeleted === false) {
      return (prisma as any).x5_app_cart.update({
        where: {
          comId_ItemId: { comId, ItemId },
        },
        data: {
          quantity: (existing as any).quantity + quantity,
        },
        include: {
          product: true,
        },
      });
    }

    // If item exists but soft deleted → restore it and update quantity
    if (existing && (existing as any).isDeleted === true) {
      return (prisma as any).x5_app_cart.update({
        where: {
          comId_ItemId: { comId, ItemId },
        },
        data: {
          quantity,
          isDeleted: false,
        },
        include: {
          product: true,
        },
      });
    }

    // If item does not exist → create new
    return (prisma as any).x5_app_cart.create({
      data: {
        comId,
        ItemId,
        quantity,
        isDeleted: false,
      },
      include: {
        product: true,
      },
    });
  }

  // ---------------- Get Cart ----------------
  async getCartByComId(comId: number) {
    return (prisma as any).x5_app_cart.findMany({
      where: {
        comId,
        isDeleted: false,
      },
      include: {
        product: {
          include: {
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
  async updateQuantity(comId: number, ItemId: number, quantity: number) {
    const existing = await (prisma as any).x5_app_cart.findFirst({
      where: {
        comId,
        ItemId,
        isDeleted: false,
      },
    });

    if (!existing) {
      throw new Error("Cart item not found");
    }

    return (prisma as any).x5_app_cart.update({
      where: {
        comId_ItemId: { comId, ItemId },
      },
      data: {
        quantity,
      },
      include: {
        product: true,
      },
    });
  }

  // ---------------- Soft Delete Single Item ----------------
  async removeCartItem(comId: number, ItemId: number) {
    return (prisma as any).x5_app_cart.update({
      where: {
        comId_ItemId: { comId, ItemId },
      },
      data: {
        isDeleted: true,
      },
    });
  }

  // ---------------- Soft Delete All ----------------
  async clearCart(comId: number) {
    return (prisma as any).x5_app_cart.updateMany({
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
