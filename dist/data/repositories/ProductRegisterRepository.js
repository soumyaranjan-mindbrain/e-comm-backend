"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProductRegistersByName = exports.getProductRegistersByDisplaySection = exports.getNewArrivals = exports.getFilteredProducts = exports.getAllProductRegisters = exports.getProductRegisterById = void 0;
const prisma_client_1 = __importDefault(require("../../prisma-client"));
const client_1 = require("@prisma/client");
const getProductRegisterById = async (id) => {
    return prisma_client_1.default.productRegister.findFirst({
        where: { id, isDisplay: client_1.x1_app_product_register_is_display.ONE },
        include: {
            images: true,
            stockItems: {
                where: { status: client_1.caa1_shop_stock_item_db_status.ONE },
                take: 1,
            },
        },
    });
};
exports.getProductRegisterById = getProductRegisterById;
const getAllProductRegisters = async (limit = 20, cursor) => {
    const take = limit + 1;
    const where = { isDisplay: client_1.x1_app_product_register_is_display.ONE };
    const products = await prisma_client_1.default.productRegister.findMany({
        where: cursor ? { ...where, id: { lt: cursor } } : where,
        include: {
            images: true,
            stockItems: {
                where: { status: client_1.caa1_shop_stock_item_db_status.ONE },
                take: 1,
            }
        },
        orderBy: { id: "desc" },
        take,
    });
    const hasMore = products.length > limit;
    const data = hasMore ? products.slice(0, limit) : products;
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1].id : null;
    return { data, nextCursor };
};
exports.getAllProductRegisters = getAllProductRegisters;
const getFilteredProducts = async (filters, limit = 20, cursor) => {
    const take = limit + 1;
    const where = {
        isDisplay: client_1.x1_app_product_register_is_display.ONE,
    };
    if (filters.q) {
        where.productName = { contains: filters.q };
    }
    // Stock table specific filters (Price and Category)
    const stockWhere = { status: client_1.caa1_shop_stock_item_db_status.ONE };
    let hasStockFilter = false;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        hasStockFilter = true;
        stockWhere.saleRate = {};
        if (filters.minPrice !== undefined)
            stockWhere.saleRate.gte = filters.minPrice;
        if (filters.maxPrice !== undefined)
            stockWhere.saleRate.lte = filters.maxPrice;
    }
    if (filters.categoryId !== undefined) {
        hasStockFilter = true;
        stockWhere.catId = filters.categoryId;
    }
    if (hasStockFilter) {
        where.stockItems = { some: stockWhere };
    }
    if (filters.rating !== undefined) {
        where.ratings = { gte: filters.rating };
    }
    const products = await prisma_client_1.default.productRegister.findMany({
        where: cursor ? { ...where, id: { lt: cursor } } : where,
        include: {
            images: true,
            stockItems: {
                where: { status: client_1.caa1_shop_stock_item_db_status.ONE },
                take: 1,
            }
        },
        orderBy: { id: "desc" },
        take,
    });
    const hasMore = products.length > limit;
    const data = hasMore ? products.slice(0, limit) : products;
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1].id : null;
    return { data, nextCursor };
};
exports.getFilteredProducts = getFilteredProducts;
const getNewArrivals = async (limit = 20, cursor) => {
    const take = limit + 1;
    const where = { isDisplay: client_1.x1_app_product_register_is_display.ONE };
    const products = await prisma_client_1.default.productRegister.findMany({
        where: cursor ? { ...where, id: { lt: cursor } } : where,
        include: {
            images: true,
            stockItems: {
                where: { status: client_1.caa1_shop_stock_item_db_status.ONE },
                take: 1,
            }
        },
        orderBy: { createdAt: "desc" },
        take,
    });
    const hasMore = products.length > limit;
    const data = hasMore ? products.slice(0, limit) : products;
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1].id : null;
    return { data, nextCursor };
};
exports.getNewArrivals = getNewArrivals;
const getProductRegistersByDisplaySection = async (displaySection, limit = 20, cursor) => {
    const take = limit + 1;
    const where = {
        isDisplay: client_1.x1_app_product_register_is_display.ONE,
        displaySection: displaySection,
    };
    const products = await prisma_client_1.default.productRegister.findMany({
        where: cursor ? { ...where, id: { lt: cursor } } : where,
        include: {
            images: true,
            stockItems: {
                where: { status: client_1.caa1_shop_stock_item_db_status.ONE },
                take: 1,
            }
        },
        orderBy: { id: "desc" },
        take,
    });
    const hasMore = products.length > limit;
    const data = hasMore ? products.slice(0, limit) : products;
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1].id : null;
    return { data, nextCursor };
};
exports.getProductRegistersByDisplaySection = getProductRegistersByDisplaySection;
const searchProductRegistersByName = async (searchTerm, limit) => {
    const queryLimit = limit && limit > 0 ? Math.floor(limit) : undefined;
    return prisma_client_1.default.productRegister.findMany({
        where: {
            isDisplay: client_1.x1_app_product_register_is_display.ONE,
            productName: { contains: searchTerm },
        },
        include: {
            images: true,
            stockItems: {
                where: { status: client_1.caa1_shop_stock_item_db_status.ONE },
                take: 1,
            }
        },
        orderBy: { createdAt: "desc" },
        ...(queryLimit && { take: queryLimit }),
    });
};
exports.searchProductRegistersByName = searchProductRegistersByName;
//# sourceMappingURL=ProductRegisterRepository.js.map