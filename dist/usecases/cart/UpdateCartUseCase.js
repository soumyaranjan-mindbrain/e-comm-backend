"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCartUseCase = void 0;
class UpdateCartUseCase {
    cartRepository;
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }
    async execute(comId, ItemId, quantity) {
        return this.cartRepository.updateQuantity(comId, ItemId, quantity);
    }
}
exports.UpdateCartUseCase = UpdateCartUseCase;
