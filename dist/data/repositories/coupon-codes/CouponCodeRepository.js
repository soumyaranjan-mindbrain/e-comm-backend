"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCouponCodesByName = exports.deleteCouponCode = exports.updateCouponCode = exports.createCouponCode = exports.getAllCouponCodes = exports.getCouponCodeById = void 0;
const prisma_client_1 = __importDefault(require("../../../prisma-client"));
const getCouponCodeById = async (id) => {
    return prisma_client_1.default.couponCode.findUnique({
        where: { id },
    });
};
exports.getCouponCodeById = getCouponCodeById;
const getAllCouponCodes = async (limit = 20, cursor) => {
    const take = limit + 1;
    const couponCodes = await prisma_client_1.default.couponCode.findMany({
        where: cursor ? { id: { lt: cursor } } : undefined,
        orderBy: { createdAt: "desc" },
        take,
    });
    const hasMore = couponCodes.length > limit;
    const data = hasMore ? couponCodes.slice(0, limit) : couponCodes;
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1].id : null;
    return { data, nextCursor };
};
exports.getAllCouponCodes = getAllCouponCodes;
const createCouponCode = async (data) => {
    return prisma_client_1.default.couponCode.create({
        data: {
            name: data.name,
            description: data.description,
            termsConditions: data.termsConditions,
            validCategory: data.validCategory,
            validBrand: data.validBrand,
            validEdition: data.validEdition,
            validItem: data.validItem,
            validPrice: data.validPrice,
            validDate: data.validDate ? new Date(data.validDate) : null,
            issuedQnty: data.issuedQnty,
            receivedQnty: data.receivedQnty,
            userQnty: data.userQnty,
            createdBy: data.createdBy,
        },
    });
};
exports.createCouponCode = createCouponCode;
const updateCouponCode = async (id, data) => {
    return prisma_client_1.default.couponCode.update({
        where: { id },
        data: {
            name: data.name,
            description: data.description,
            termsConditions: data.termsConditions,
            validCategory: data.validCategory,
            validBrand: data.validBrand,
            validEdition: data.validEdition,
            validItem: data.validItem,
            validPrice: data.validPrice,
            validDate: data.validDate ? new Date(data.validDate) : undefined,
            issuedQnty: data.issuedQnty,
            receivedQnty: data.receivedQnty,
            userQnty: data.userQnty,
            updatedBy: data.updatedBy,
            updatedAt: new Date(),
        },
    });
};
exports.updateCouponCode = updateCouponCode;
const deleteCouponCode = async (id) => {
    return prisma_client_1.default.couponCode.delete({
        where: { id },
    });
};
exports.deleteCouponCode = deleteCouponCode;
const searchCouponCodesByName = async (searchTerm, limit) => {
    const queryLimit = limit && limit > 0 ? Math.floor(limit) : undefined;
    const trimmedSearchTerm = searchTerm.trim();
    const couponCodes = await prisma_client_1.default.couponCode.findMany({
        where: {
            name: {
                contains: trimmedSearchTerm,
            },
        },
        orderBy: { createdAt: "desc" },
        ...(queryLimit && { take: queryLimit }),
    });
    return couponCodes;
};
exports.searchCouponCodesByName = searchCouponCodesByName;
//# sourceMappingURL=CouponCodeRepository.js.map