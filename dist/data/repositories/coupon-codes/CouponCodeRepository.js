"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCoupons = exports.deleteCoupon = exports.updateCoupon = exports.createCoupon = exports.getCouponById = exports.getAllCoupons = void 0;
const prisma_client_1 = __importDefault(require("../../../prisma-client"));
const getAllCoupons = () => prisma_client_1.default.couponCode.findMany({
    orderBy: { createdAt: "desc" },
});
exports.getAllCoupons = getAllCoupons;
const getCouponById = (id) => prisma_client_1.default.couponCode.findUnique({
    where: { id },
});
exports.getCouponById = getCouponById;
const createCoupon = (data) => prisma_client_1.default.couponCode.create({ data });
exports.createCoupon = createCoupon;
const updateCoupon = (id, data) => prisma_client_1.default.couponCode.update({
    where: { id },
    data,
});
exports.updateCoupon = updateCoupon;
const deleteCoupon = (id) => prisma_client_1.default.couponCode.delete({
    where: { id },
});
exports.deleteCoupon = deleteCoupon;
const searchCoupons = (q) => prisma_client_1.default.couponCode.findMany({
    where: {
        name: {
            contains: q,
        },
    },
    orderBy: { createdAt: "desc" },
});
exports.searchCoupons = searchCoupons;
