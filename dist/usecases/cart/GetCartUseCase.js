"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCartUseCase = void 0;
class GetCartUseCase {
    cartRepository;
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }
    async execute(comId) {
        return this.cartRepository.getCartByComId(comId);
    }
}
exports.GetCartUseCase = GetCartUseCase;
//# sourceMappingURL=GetCartUseCase.js.map