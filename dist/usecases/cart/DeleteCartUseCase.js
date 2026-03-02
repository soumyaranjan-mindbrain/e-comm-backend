"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCartUseCase = void 0;
class DeleteCartUseCase {
    cartRepository;
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }
    async execute(comId, ItemId) {
        return this.cartRepository.removeCartItem(comId, ItemId);
    }
}
exports.DeleteCartUseCase = DeleteCartUseCase;
//# sourceMappingURL=DeleteCartUseCase.js.map