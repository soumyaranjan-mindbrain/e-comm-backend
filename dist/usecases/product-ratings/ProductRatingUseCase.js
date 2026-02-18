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
exports.getProductRatingStats = exports.deleteProductRating = exports.updateProductRating = exports.createProductRating = exports.getAllProductRatings = exports.getProductRatingsByProductId = exports.getProductRatingById = void 0;
const productRatingRepository = __importStar(require("../../data/repositories/ProductRatingRepository"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const getProductRatingById = async (id) => {
    const rating = await productRatingRepository.getProductRatingById(id);
    if (!rating) {
        throw AppError_1.default.notFound("Product rating not found.");
    }
    return rating;
};
exports.getProductRatingById = getProductRatingById;
const getProductRatingsByProductId = async (productId, limit, cursor) => {
    const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
    const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
    return await productRatingRepository.getProductRatingsByProductId(productId, queryLimit, queryCursor);
};
exports.getProductRatingsByProductId = getProductRatingsByProductId;
const getAllProductRatings = async (limit, cursor) => {
    const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
    const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
    return await productRatingRepository.getAllProductRatings(queryLimit, queryCursor);
};
exports.getAllProductRatings = getAllProductRatings;
const createProductRating = async (data) => {
    // Validate that givenRatings is within valid range (typically 1-5)
    if (data.givenRatings !== undefined) {
        if (data.givenRatings < 1 || data.givenRatings > 5) {
            throw AppError_1.default.badRequest("Given rating must be between 1 and 5.");
        }
    }
    return await productRatingRepository.createProductRating(data);
};
exports.createProductRating = createProductRating;
const updateProductRating = async (id, data) => {
    // Check if rating exists
    const existingRating = await productRatingRepository.getProductRatingById(id);
    if (!existingRating) {
        throw AppError_1.default.notFound("Product rating not found.");
    }
    // Validate that givenRatings is within valid range (typically 1-5)
    if (data.givenRatings !== undefined) {
        if (data.givenRatings < 1 || data.givenRatings > 5) {
            throw AppError_1.default.badRequest("Given rating must be between 1 and 5.");
        }
    }
    return await productRatingRepository.updateProductRating(id, data);
};
exports.updateProductRating = updateProductRating;
const deleteProductRating = async (id) => {
    const existingRating = await productRatingRepository.getProductRatingById(id);
    if (!existingRating) {
        throw AppError_1.default.notFound("Product rating not found.");
    }
    return await productRatingRepository.deleteProductRating(id);
};
exports.deleteProductRating = deleteProductRating;
const getProductRatingStats = async (productId) => {
    return await productRatingRepository.getProductRatingStats(productId);
};
exports.getProductRatingStats = getProductRatingStats;
//# sourceMappingURL=ProductRatingUseCase.js.map