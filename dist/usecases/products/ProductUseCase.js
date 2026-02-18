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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredProducts = exports.searchProductRegistersByName = exports.getProductRegisterById = exports.getAllProductRegisters = exports.getProductsByCategorySlug = exports.getNewArrivals = void 0;
const productRegisterRepository = __importStar(require("../../data/repositories/ProductRegisterRepository"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
// Helper to flatten product data (extract price/MRP from nested stockItems)
const transformProduct = (product) => {
    const stock = product.stockItems?.[0];
    return {
        ...product,
        price: stock?.saleRate || null,
        mrp: stock?.mrpRate || null,
        // Keep original stockItems but usually frontend only needs the flattened price
    };
};
// Slug to displaySection mapping (API slugs -> DB values)
const SLUG_TO_SECTION = {
    fashion: "Fashion",
    featured: "Featured",
    trending: "Trending",
    "new-arrivals": "New Arrival",
    "new arrival": "New Arrival",
};
const getNewArrivals = async (limit, cursor) => {
    const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
    const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
    const result = await productRegisterRepository.getNewArrivals(queryLimit, queryCursor);
    return {
        ...result,
        data: result.data.map(transformProduct)
    };
};
exports.getNewArrivals = getNewArrivals;
// Get products by category slug
const getProductsByCategorySlug = async (slug, limit, cursor) => {
    const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
    const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
    const displaySection = SLUG_TO_SECTION[slug.toLowerCase()] ?? slug;
    const result = await productRegisterRepository.getProductRegistersByDisplaySection(displaySection, queryLimit, queryCursor);
    return {
        ...result,
        data: result.data.map(transformProduct)
    };
};
exports.getProductsByCategorySlug = getProductsByCategorySlug;
// Get all product registers
const getAllProductRegisters = async (limit, cursor) => {
    const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
    const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
    const result = await productRegisterRepository.getAllProductRegisters(queryLimit, queryCursor);
    return {
        ...result,
        data: result.data.map(transformProduct)
    };
};
exports.getAllProductRegisters = getAllProductRegisters;
// Get product register by ID
const getProductRegisterById = async (id) => {
    const product = await productRegisterRepository.getProductRegisterById(id);
    if (!product) {
        throw AppError_1.default.notFound("Product register not found.");
    }
    return transformProduct(product);
};
exports.getProductRegisterById = getProductRegisterById;
// Search product registers by name
const searchProductRegistersByName = async (searchTerm, limit) => {
    const products = await productRegisterRepository.searchProductRegistersByName(searchTerm.trim(), limit);
    return products.map(transformProduct);
};
exports.searchProductRegistersByName = searchProductRegistersByName;
const getFilteredProducts = async (filters) => {
    const limit = filters.limit ? Math.floor(filters.limit) : 20;
    const cursor = filters.cursor ? Math.floor(filters.cursor) : undefined;
    const result = await productRegisterRepository.getFilteredProducts({
        q: filters.q?.trim(),
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        rating: filters.rating,
        categoryId: filters.categoryId,
    }, limit, cursor);
    return {
        ...result,
        data: result.data.map(transformProduct)
    };
};
exports.getFilteredProducts = getFilteredProducts;
