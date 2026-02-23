"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductRatingStats = exports.deleteProductRating = exports.updateProductRating = exports.createProductRating = exports.getAllProductRatings = exports.getProductRatingsByProductId = exports.getProductRatingById = void 0;
const prisma_client_1 = __importDefault(require("../../../prisma-client"));
const getProductRatingById = async (id) => {
    return prisma_client_1.default.productRating.findUnique({
        where: { id },
    });
};
exports.getProductRatingById = getProductRatingById;
const getProductRatingsByProductId = async (productId, limit = 20, cursor) => {
    const take = limit + 1;
    const where = { productId };
    const ratings = await prisma_client_1.default.productRating.findMany({
        where: cursor ? { ...where, id: { lt: cursor } } : where,
        include: {
            customer: {
                select: {
                    fullName: true,
                    profileImage: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
        take,
    });
    const hasMore = ratings.length > limit;
    const data = hasMore ? ratings.slice(0, limit) : ratings;
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1].id : null;
    return { data, nextCursor };
};
exports.getProductRatingsByProductId = getProductRatingsByProductId;
const getAllProductRatings = async (limit = 20, cursor) => {
    const take = limit + 1;
    const ratings = await prisma_client_1.default.productRating.findMany({
        where: cursor ? { id: { lt: cursor } } : undefined,
        orderBy: { createdAt: "desc" },
        take,
    });
    const hasMore = ratings.length > limit;
    const data = hasMore ? ratings.slice(0, limit) : ratings;
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1].id : null;
    return { data, nextCursor };
};
exports.getAllProductRatings = getAllProductRatings;
const createProductRating = async (data) => {
    return prisma_client_1.default.productRating.create({
        data: {
            productId: data.productId,
            totalRatings: data.totalRatings,
            givenRatings: data.givenRatings,
            message: data.message,
            createdBy: data.createdBy,
        },
    });
};
exports.createProductRating = createProductRating;
const updateProductRating = async (id, data) => {
    return prisma_client_1.default.productRating.update({
        where: { id },
        data: {
            productId: data.productId,
            totalRatings: data.totalRatings,
            givenRatings: data.givenRatings,
            message: data.message,
            updatedBy: data.updatedBy,
            updatedAt: new Date(),
        },
    });
};
exports.updateProductRating = updateProductRating;
const deleteProductRating = async (id) => {
    return prisma_client_1.default.productRating.delete({
        where: { id },
    });
};
exports.deleteProductRating = deleteProductRating;
const getProductRatingStats = async (productId) => {
    const ratings = await prisma_client_1.default.productRating.findMany({
        where: { productId },
        select: { givenRatings: true },
    });
    const totalCount = ratings.length;
    const validRatings = ratings.filter((r) => r.givenRatings !== null);
    const sum = validRatings.reduce((acc, r) => acc + (r.givenRatings || 0), 0);
    const averageRating = validRatings.length > 0 ? sum / validRatings.length : 0;
    // Count distribution
    const distribution = {};
    validRatings.forEach((r) => {
        const rating = r.givenRatings || 0;
        distribution[rating] = (distribution[rating] || 0) + 1;
    });
    const ratingDistribution = Object.entries(distribution).map(([rating, count]) => ({
        rating: parseInt(rating),
        count,
    }));
    return {
        totalCount,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        ratingDistribution: ratingDistribution.sort((a, b) => b.rating - a.rating),
    };
};
exports.getProductRatingStats = getProductRatingStats;
