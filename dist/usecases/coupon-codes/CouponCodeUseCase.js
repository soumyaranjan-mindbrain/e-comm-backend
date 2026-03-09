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
exports.searchCouponCodesByName = exports.deleteCouponCode = exports.updateCouponCode = exports.createCouponCode = exports.getCouponCodeById = exports.getAllCouponCodes = void 0;
const repo = __importStar(require("../../data/repositories/coupon-codes/CouponCodeRepository"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const getAllCouponCodes = () => repo.getAllCoupons();
exports.getAllCouponCodes = getAllCouponCodes;
const getCouponCodeById = async (id) => {
    const coupon = await repo.getCouponById(id);
    if (!coupon)
        throw AppError_1.default.notFound("Coupon not found");
    return coupon;
};
exports.getCouponCodeById = getCouponCodeById;
const createCouponCode = async (data) => {
    if (!data.name)
        throw AppError_1.default.badRequest("Coupon name required");
    return repo.createCoupon(data);
};
exports.createCouponCode = createCouponCode;
const updateCouponCode = async (id, data) => {
    await (0, exports.getCouponCodeById)(id);
    return repo.updateCoupon(id, data);
};
exports.updateCouponCode = updateCouponCode;
const deleteCouponCode = async (id) => {
    await (0, exports.getCouponCodeById)(id);
    return repo.deleteCoupon(id);
};
exports.deleteCouponCode = deleteCouponCode;
const searchCouponCodesByName = (q) => repo.searchCoupons(q);
exports.searchCouponCodesByName = searchCouponCodesByName;
