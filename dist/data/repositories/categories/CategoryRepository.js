"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategories = exports.getCategoryById = void 0;
const prisma_client_1 = __importDefault(require("../../../prisma-client"));
const client_1 = require("@prisma/client");
const getCategoryById = async (id) => {
    return prisma_client_1.default.category.findUnique({
        where: { id },
    });
};
exports.getCategoryById = getCategoryById;
const getAllCategories = async (limit = 20, cursor, search) => {
    const take = limit + 1; // Fetch one extra to determine if there are more records
    const where = {
        status: client_1.aa4_category_db_status.ONE,
    };
    if (search) {
        where.catName = {
            contains: search,
        };
    }
    const [categories, totalCount] = await Promise.all([
        prisma_client_1.default.category.findMany({
            where: cursor ? { ...where, id: { gt: cursor } } : where,
            orderBy: { disorder: "asc" },
            take,
        }),
        prisma_client_1.default.category.count({ where }),
    ]);
    const hasMore = categories.length > limit;
    const data = hasMore ? categories.slice(0, limit) : categories;
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1].id : null;
    return {
        data,
        nextCursor,
        totalCount,
    };
};
exports.getAllCategories = getAllCategories;
