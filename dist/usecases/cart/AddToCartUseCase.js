"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddToCartUseCase = void 0;
class AddToCartUseCase {
    cartRepository;
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }
    async execute(comId, ItemId, quantity) {
        if (!ItemId)
            throw new Error("Product ID required");
        return this.cartRepository.addToCart(comId, ItemId, quantity);
    }
}
exports.AddToCartUseCase = AddToCartUseCase;
