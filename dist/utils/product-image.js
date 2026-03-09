"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductMainImage = void 0;
const getProductMainImage = (product) => {
    if (!product)
        return null;
    return product.proimg || product.images?.[0]?.proimgs || null;
};
exports.getProductMainImage = getProductMainImage;
