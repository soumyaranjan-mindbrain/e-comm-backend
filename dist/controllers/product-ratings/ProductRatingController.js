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
exports.getStats = exports.remove = exports.update = exports.create = exports.getOne = exports.getByProductId = exports.getAll = void 0;
const productRatingUseCase = __importStar(require("../../usecases/product-ratings/ProductRatingUseCase"));
const getAll = async (req, res, next) => {
    try {
        const parsedLimit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const parsedCursor = req.query.cursor ? parseInt(req.query.cursor) : undefined;
        const limit = isNaN(parsedLimit) ? undefined : parsedLimit;
        const cursor = isNaN(parsedCursor) ? undefined : parsedCursor;
        const result = await productRatingUseCase.getAllProductRatings(limit, cursor);
        res.status(200).json({
            success: true,
            count: result.data.length,
            data: result.data,
            nextCursor: result.nextCursor,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const getByProductId = async (req, res, next) => {
    try {
        const productId = parseInt(req.params.productId);
        const parsedLimit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const parsedCursor = req.query.cursor ? parseInt(req.query.cursor) : undefined;
        const limit = isNaN(parsedLimit) ? undefined : parsedLimit;
        const cursor = isNaN(parsedCursor) ? undefined : parsedCursor;
        if (isNaN(productId)) {
            res.status(400).json({
                success: false,
                message: "Invalid product ID.",
            });
            return;
        }
        const result = await productRatingUseCase.getProductRatingsByProductId(productId, limit, cursor);
        res.status(200).json({
            success: true,
            count: result.data.length,
            data: result.data,
            nextCursor: result.nextCursor,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getByProductId = getByProductId;
const getOne = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "Invalid ID." });
            return;
        }
        const rating = await productRatingUseCase.getProductRatingById(id);
        res.status(200).json({
            success: true,
            data: rating,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getOne = getOne;
const create = async (req, res, next) => {
    try {
        const { productId, totalRatings, givenRatings, message, createdBy } = req.body;
        const rating = await productRatingUseCase.createProductRating({
            productId,
            totalRatings,
            givenRatings,
            message,
            createdBy,
        });
        res.status(201).json({
            success: true,
            data: rating,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const update = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "Invalid ID." });
            return;
        }
        const { productId, totalRatings, givenRatings, message, updatedBy } = req.body;
        const rating = await productRatingUseCase.updateProductRating(id, {
            productId,
            totalRatings,
            givenRatings,
            message,
            updatedBy,
        });
        res.status(200).json({
            success: true,
            data: rating,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.update = update;
const remove = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ success: false, message: "Invalid ID." });
            return;
        }
        await productRatingUseCase.deleteProductRating(id);
        res.status(200).json({
            success: true,
            message: "Product rating deleted successfully.",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.remove = remove;
const getStats = async (req, res, next) => {
    try {
        const productId = parseInt(req.params.productId);
        if (isNaN(productId)) {
            res.status(400).json({
                success: false,
                message: "Invalid product ID.",
            });
            return;
        }
        const stats = await productRatingUseCase.getProductRatingStats(productId);
        res.status(200).json({
            success: true,
            data: stats,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getStats = getStats;
//# sourceMappingURL=ProductRatingController.js.map