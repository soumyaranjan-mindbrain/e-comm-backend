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
exports.searchCouponCodesByName = exports.deleteCouponCode = exports.updateCouponCode = exports.createCouponCode = exports.getAllCouponCodes = exports.getCouponCodeById = void 0;
const couponCodeRepository = __importStar(require("../../data/repositories/CouponCodeRepository"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const getCouponCodeById = async (id) => {
    const couponCode = await couponCodeRepository.getCouponCodeById(id);
    if (!couponCode) {
        throw AppError_1.default.notFound(`Coupon code with ID ${id} not found.`);
    }
    return couponCode;
};
exports.getCouponCodeById = getCouponCodeById;
const getAllCouponCodes = async (limit, cursor) => {
    const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
    const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
    return await couponCodeRepository.getAllCouponCodes(queryLimit, queryCursor);
};
exports.getAllCouponCodes = getAllCouponCodes;
const createCouponCode = async (data) => {
    // Validate validDate if provided
    if (data.validDate) {
        const validDate = new Date(data.validDate);
        if (isNaN(validDate.getTime())) {
            throw AppError_1.default.badRequest("Invalid valid date format.");
        }
        // Check if validDate is in the past (compare dates at start of day to avoid timezone issues)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const validDateStart = new Date(validDate);
        validDateStart.setHours(0, 0, 0, 0);
        if (validDateStart < today) {
            throw AppError_1.default.badRequest("Valid date cannot be in the past.");
        }
    }
    // Validate quantities are non-negative
    if (data.issuedQnty !== undefined && data.issuedQnty < 0) {
        throw AppError_1.default.badRequest("Issued quantity cannot be negative.");
    }
    if (data.receivedQnty !== undefined && data.receivedQnty < 0) {
        throw AppError_1.default.badRequest("Received quantity cannot be negative.");
    }
    if (data.userQnty !== undefined && data.userQnty < 0) {
        throw AppError_1.default.badRequest("User quantity cannot be negative.");
    }
    // Validate validPrice is non-negative
    if (data.validPrice !== undefined && data.validPrice < 0) {
        throw AppError_1.default.badRequest("Valid price cannot be negative.");
    }
    return await couponCodeRepository.createCouponCode(data);
};
exports.createCouponCode = createCouponCode;
const updateCouponCode = async (id, data) => {
    // Check if coupon code exists
    const existingCouponCode = await couponCodeRepository.getCouponCodeById(id);
    if (!existingCouponCode) {
        throw AppError_1.default.notFound(`Coupon code with ID ${id} not found.`);
    }
    // Validate validDate if provided
    if (data.validDate) {
        const validDate = new Date(data.validDate);
        if (isNaN(validDate.getTime())) {
            throw AppError_1.default.badRequest("Invalid valid date format.");
        }
        // Check if validDate is in the past (compare dates at start of day to avoid timezone issues)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const validDateStart = new Date(validDate);
        validDateStart.setHours(0, 0, 0, 0);
        if (validDateStart < today) {
            throw AppError_1.default.badRequest("Valid date cannot be in the past.");
        }
    }
    // Validate quantities are non-negative
    if (data.issuedQnty !== undefined && data.issuedQnty < 0) {
        throw AppError_1.default.badRequest("Issued quantity cannot be negative.");
    }
    if (data.receivedQnty !== undefined && data.receivedQnty < 0) {
        throw AppError_1.default.badRequest("Received quantity cannot be negative.");
    }
    if (data.userQnty !== undefined && data.userQnty < 0) {
        throw AppError_1.default.badRequest("User quantity cannot be negative.");
    }
    // Validate validPrice is non-negative
    if (data.validPrice !== undefined && data.validPrice < 0) {
        throw AppError_1.default.badRequest("Valid price cannot be negative.");
    }
    return await couponCodeRepository.updateCouponCode(id, data);
};
exports.updateCouponCode = updateCouponCode;
const deleteCouponCode = async (id) => {
    const existingCouponCode = await couponCodeRepository.getCouponCodeById(id);
    if (!existingCouponCode) {
        throw AppError_1.default.notFound(`Coupon code with ID ${id} not found.`);
    }
    return await couponCodeRepository.deleteCouponCode(id);
};
exports.deleteCouponCode = deleteCouponCode;
const searchCouponCodesByName = async (searchTerm, limit) => {
    if (!searchTerm || searchTerm.trim() === "") {
        throw AppError_1.default.badRequest("Search term is required.");
    }
    return await couponCodeRepository.searchCouponCodesByName(searchTerm, limit);
};
exports.searchCouponCodesByName = searchCouponCodesByName;
