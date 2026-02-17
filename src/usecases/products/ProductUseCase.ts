import * as productRegisterRepository from "../../data/repositories/ProductRegisterRepository";
import AppError from "../../errors/AppError";

// Get new arrivals (ProductRegisters sorted by createdAt, newest first)
export const getNewArrivals = async (limit?: number, cursor?: number) => {
    const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
    const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
    return await productRegisterRepository.getNewArrivals(
        queryLimit,
        queryCursor
    );
};

// Slug to displaySection mapping (API slugs -> DB values)
const SLUG_TO_SECTION: Record<string, string> = {
    fashion: "Fashion",
    featured: "Featured",
    trending: "Trending",
    "new-arrivals": "New Arrival",
    "new arrival": "New Arrival",
};

// Get products by category slug (filters ProductRegister by displaySection)
export const getProductsByCategorySlug = async (
    slug: string,
    limit?: number,
    cursor?: number
) => {
    const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
    const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
    const displaySection = SLUG_TO_SECTION[slug.toLowerCase()] ?? slug;
    return await productRegisterRepository.getProductRegistersByDisplaySection(
        displaySection,
        queryLimit,
        queryCursor
    );
};

// Get all product registers
export const getAllProductRegisters = async (
    limit?: number,
    cursor?: number
) => {
    const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
    const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
    return await productRegisterRepository.getAllProductRegisters(
        queryLimit,
        queryCursor
    );
};

// Get product register by ID
export const getProductRegisterById = async (id: number) => {
    const product = await productRegisterRepository.getProductRegisterById(id);
    if (!product) {
        throw AppError.notFound("Product register not found.");
    }
    return product;
};

// Search product registers by name
export const searchProductRegistersByName = async (
    searchTerm: string,
    limit?: number
) => {
    return await productRegisterRepository.searchProductRegistersByName(
        searchTerm,
        limit
    );
};

export const getFilteredProducts = async (filters: any) => {
    const limit = filters.limit ? Math.floor(filters.limit) : 20;
    const cursor = filters.cursor ? Math.floor(filters.cursor) : undefined;

    return await productRegisterRepository.getFilteredProducts(
        {
            q: filters.q,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            rating: filters.rating,
            categoryId: filters.categoryId,
        },
        limit,
        cursor
    );
};
