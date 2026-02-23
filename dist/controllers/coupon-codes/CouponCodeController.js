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
exports.search = exports.remove = exports.update = exports.create = exports.getOne = exports.getAll = void 0;
const couponCodeUseCase = __importStar(require("../../usecases/coupon-codes/CouponCodeUseCase"));
const getAll = async (req, res, next) => {
    try {
        const limit = req.query.limit
            ? parseInt(req.query.limit)
            : undefined;
        const cursor = req.query.cursor
            ? parseInt(req.query.cursor)
            : undefined;
        const result = await couponCodeUseCase.getAllCouponCodes(limit, cursor);
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
const getOne = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid coupon code ID.",
            });
            return;
        }
        const couponCode = await couponCodeUseCase.getCouponCodeById(id);
        res.status(200).json({
            success: true,
            data: couponCode,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getOne = getOne;
const create = async (req, res, next) => {
    try {
        const { name, description, termsConditions, validCategory, validBrand, validEdition, validItem, validPrice, validDate, issuedQnty, receivedQnty, userQnty, createdBy, } = req.body;
        const couponCode = await couponCodeUseCase.createCouponCode({
            name,
            description,
            termsConditions,
            validCategory,
            validBrand,
            validEdition,
            validItem,
            validPrice,
            validDate,
            issuedQnty,
            receivedQnty,
            userQnty,
            createdBy,
        });
        res.status(201).json({
            success: true,
            message: "Coupon code created successfully.",
            data: couponCode,
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
            res.status(400).json({
                success: false,
                message: "Invalid coupon code ID.",
            });
            return;
        }
        const { name, description, termsConditions, validCategory, validBrand, validEdition, validItem, validPrice, validDate, issuedQnty, receivedQnty, userQnty, updatedBy, } = req.body;
        const couponCode = await couponCodeUseCase.updateCouponCode(id, {
            name,
            description,
            termsConditions,
            validCategory,
            validBrand,
            validEdition,
            validItem,
            validPrice,
            validDate,
            issuedQnty,
            receivedQnty,
            userQnty,
            updatedBy,
        });
        res.status(200).json({
            success: true,
            message: "Coupon code updated successfully.",
            data: couponCode,
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
            res.status(400).json({
                success: false,
                message: "Invalid coupon code ID.",
            });
            return;
        }
        await couponCodeUseCase.deleteCouponCode(id);
        res.status(200).json({
            success: true,
            message: "Coupon code deleted successfully.",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.remove = remove;
const search = async (req, res, next) => {
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
        const couponCodes = await couponCodeUseCase.searchCouponCodesByName(searchTerm.trim(), limit);
        res.status(200).json({
            success: true,
            count: couponCodes.length,
            searchTerm: searchTerm.trim(),
            data: couponCodes,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.search = search;
