"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProductImageRegisters = exports.getProductImageRegistersByProductId = exports.getProductImageRegisterById = void 0;
const prisma_client_1 = __importDefault(require("../../prisma-client"));
const client_1 = require("@prisma/client");
const getProductImageRegisterById = async (id) => {
    return prisma_client_1.default.productImageRegister.findFirst({
        where: { id, status: client_1.x2_app_product_img_register_status.ONE },
    });
};
exports.getProductImageRegisterById = getProductImageRegisterById;
const getProductImageRegistersByProductId = async (productId) => {
    return prisma_client_1.default.productImageRegister.findMany({
        where: { productId, status: client_1.x2_app_product_img_register_status.ONE },
        orderBy: { id: "asc" },
    });
};
exports.getProductImageRegistersByProductId = getProductImageRegistersByProductId;
const getAllProductImageRegisters = async (limit = 50, cursor) => {
    const take = limit + 1;
    const where = { status: client_1.x2_app_product_img_register_status.ONE };
    const images = await prisma_client_1.default.productImageRegister.findMany({
        where: cursor ? { ...where, id: { lt: cursor } } : where,
        orderBy: { id: "desc" },
        take,
    });
    const hasMore = images.length > limit;
    const data = hasMore ? images.slice(0, limit) : images;
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1].id : null;
    return { data, nextCursor };
};
exports.getAllProductImageRegisters = getAllProductImageRegisters;
