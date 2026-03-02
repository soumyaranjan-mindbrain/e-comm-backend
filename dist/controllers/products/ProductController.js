"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOne = exports.searchProducts = exports.getAll = void 0;
const productUseCase = __importStar(require("../../usecases/products/ProductUseCase"));
const DEFAULT_LIMIT = 10;
const getAll = async (req, res, next) => {
    try {
        const queryData = res.locals.validatedQuery || req.query;
        const { slugs, q, minPrice, maxPrice, rating, categoryId } = queryData;
        // Pagination — supports both cursor and page-based
        const rawLimit = queryData.limit ? parseInt(queryData.limit) : DEFAULT_LIMIT;
        const limit = isNaN(rawLimit) || rawLimit < 1 ? DEFAULT_LIMIT : Math.min(rawLimit, 100);
        const cursor = queryData.cursor ? parseInt(queryData.cursor) : undefined;
        let result;
        if (slugs === "new-arrivals") {
            result = await productUseCase.getNewArrivals(limit, cursor);
        }
        else if (slugs) {
            result = await productUseCase.getProductsByCategorySlug(slugs, limit, cursor);
        }
        else if (q || minPrice || maxPrice || rating || categoryId) {
            result = await productUseCase.getFilteredProducts({
                q,
                minPrice: minPrice ? parseFloat(minPrice) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
                rating: rating ? parseFloat(rating) : undefined,
                categoryId: categoryId ? parseInt(categoryId) : undefined,
                limit,
                cursor,
            });
        }
        else {
            result = await productUseCase.getAllProductRegisters(limit, cursor);
        }
        res.status(200).json({
            success: true,
            count: result.data.length,
            total: result.totalCount,
            nextCursor: result.nextCursor ?? null,
            hasMore: result.nextCursor !== null,
            data: result.data,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const searchProducts = async (req, res, next) => {
    try {
        const searchTerm = req.query.q;
        const rawLimit = req.query.limit ? parseInt(req.query.limit) : DEFAULT_LIMIT;
        const limit = isNaN(rawLimit) || rawLimit < 1 ? DEFAULT_LIMIT : Math.min(rawLimit, 100);
        if (!searchTerm || searchTerm.trim() === "") {
            res.status(400).json({
                success: false,
                message: "search term is required",
            });
            return;
        }
        const products = await productUseCase.searchProductRegistersByName(searchTerm.trim(), limit);
        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.searchProducts = searchProducts;
const getOne = async (req, res, next) => {
    try {
        const productId = parseInt(req.params.id);
        if (isNaN(productId)) {
            res.status(400).json({
                success: false,
                message: "invalid product id",
            });
            return;
        }
        const result = await productUseCase.getProductDetail(productId);
        res.status(200).json({
            success: true,
            data: result.product,
            relatedProducts: result.relatedProducts,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getOne = getOne;
//# sourceMappingURL=ProductController.js.map