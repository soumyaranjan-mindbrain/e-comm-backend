"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearCartUseCase = void 0;
class ClearCartUseCase {
    cartRepository;
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }
    async execute(comId) {
        return this.cartRepository.clearCart(comId);
    }
}
exports.ClearCartUseCase = ClearCartUseCase;
