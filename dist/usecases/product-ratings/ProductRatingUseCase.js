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
const productRatingRepository = __importStar(require("../../data/repositories/product-ratings/ProductRatingRepository"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const CloudinaryService_1 = require("../../services/CloudinaryService");
const getProductRatingById = async (id) => {
    const rating = await productRatingRepository.getProductRatingByIdWithRelations(id);
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
    const { reviewImages, ...ratingPayload } = data;
    const rating = await productRatingRepository.createProductRating(ratingPayload);
    const sanitizedImages = await processReviewImages(reviewImages);
    if (sanitizedImages.length > 0) {
        await productRatingRepository.createProductRatingImages(rating.id, sanitizedImages);
    }
    const ratingWithRelations = await productRatingRepository.getProductRatingByIdWithRelations(rating.id);
    if (!ratingWithRelations) {
        throw AppError_1.default.internal("Unable to fetch created product rating.");
    }
    return ratingWithRelations;
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
const isHttpUrl = (value) => /^https?:\/\//i.test(value.trim());
const extractBase64Data = (value) => {
    if (value.includes(",")) {
        return value.split(",").pop() ?? "";
    }
    return value;
};
const processReviewImages = async (reviewImages) => {
    if (!reviewImages || reviewImages.length === 0) {
        return [];
    }
    const validatedImages = [];
    for (const image of reviewImages) {
        const trimmed = image.trim();
        if (!trimmed)
            continue;
        if (isHttpUrl(trimmed)) {
            validatedImages.push({ url: trimmed });
            continue;
        }
        const base64Data = extractBase64Data(trimmed);
        if (!base64Data) {
            throw AppError_1.default.badRequest("Invalid review image payload.");
        }
        let buffer;
        try {
            buffer = Buffer.from(base64Data, "base64");
        }
        catch (error) {
            throw AppError_1.default.badRequest("Unable to decode review image data.");
        }
        if (!buffer.length) {
            throw AppError_1.default.badRequest("Review image data is empty.");
        }
        let uploadResult;
        try {
            uploadResult = await CloudinaryService_1.cloudinaryService.uploadImage(buffer, "bm2mall/reviews");
        }
        catch (error) {
            throw AppError_1.default.internal("Failed to upload review image.");
        }
        validatedImages.push({
            url: uploadResult.url,
            cloudinaryPublicId: uploadResult.publicId,
        });
    }
    return validatedImages;
};
