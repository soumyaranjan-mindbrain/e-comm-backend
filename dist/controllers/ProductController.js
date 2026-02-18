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
const productUseCase = __importStar(require("../usecases/products/ProductUseCase"));
const getAll = async (req, res, next) => {
    try {
        // Use res.locals.validatedQuery if available (from validateRequest middleware), otherwise req.query
        const queryData = res.locals.validatedQuery || req.query;
        const { slugs, q, minPrice, maxPrice, rating, categoryId, limit, cursor } = queryData;
        let result;
        if (slugs === "new-arrivals") {
            result = await productUseCase.getNewArrivals(limit ? parseInt(limit) : undefined, cursor ? parseInt(cursor) : undefined);
        }
        else if (slugs) {
            result = await productUseCase.getProductsByCategorySlug(slugs, limit ? parseInt(limit) : undefined, cursor ? parseInt(cursor) : undefined);
        }
        else if (q || minPrice || maxPrice || rating || categoryId) {
            result = await productUseCase.getFilteredProducts({
                q,
                minPrice: minPrice ? parseFloat(minPrice) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
                rating: rating ? parseFloat(rating) : undefined,
                categoryId: categoryId ? parseInt(categoryId) : undefined,
                limit: limit ? parseInt(limit) : undefined,
                cursor: cursor ? parseInt(cursor) : undefined,
            });
        }
        else {
            result = await productUseCase.getAllProductRegisters(limit ? parseInt(limit) : undefined, cursor ? parseInt(cursor) : undefined);
        }
        res.status(200).json({
            success: true,
            count: result.totalCount, // Return total matches for better testing clarity
            data: result.data,
            nextCursor: result.nextCursor,
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
        const limit = req.query.limit ? parseInt(req.query.limit) : 50;
        if (!searchTerm || searchTerm.trim() === "") {
            res.status(400).json({
                success: false,
                message: "Search term is required. Please provide 'q' query parameter.",
            });
            return;
        }
        const products = await productUseCase.searchProductRegistersByName(searchTerm.trim(), limit);
        res.status(200).json({
            success: true,
            count: products.length,
            searchTerm: searchTerm.trim(),
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
        const product = await productUseCase.getProductRegisterById(parseInt(req.params.id));
        res.status(200).json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getOne = getOne;
