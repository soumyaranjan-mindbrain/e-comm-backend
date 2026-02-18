import * as productRegisterRepository from "../../data/repositories/ProductRegisterRepository";
import AppError from "../../errors/AppError";

// Helper to flatten product data (extract price/MRP from nested stockItems)
const transformProduct = (product: any) => {
    const stock = product.stockItems?.[0];
    return {
        ...product,
        price: stock?.saleRate || null,
        mrp: stock?.mrpRate || null,
        // Keep original stockItems but usually frontend only needs the flattened price
    };
};

// Slug to displaySection mapping (API slugs -> DB values)
const SLUG_TO_SECTION: Record<string, string> = {
    fashion: "Fashion",
    featured: "Featured",
    trending: "Trending",
    "new-arrivals": "New Arrival",
    "new arrival": "New Arrival",
};

export const getNewArrivals = async (limit?: number, cursor?: number) => {
    const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
    const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
    const result = await productRegisterRepository.getNewArrivals(
        queryLimit,
        queryCursor
    );
    return {
        ...result,
        data: result.data.map(transformProduct)
    };
};

// Get products by category slug
export const getProductsByCategorySlug = async (
    slug: string,
    limit?: number,
    cursor?: number
) => {
    const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
    const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
    const displaySection = SLUG_TO_SECTION[slug.toLowerCase()] ?? slug;
    const result = await productRegisterRepository.getProductRegistersByDisplaySection(
        displaySection,
        queryLimit,
        queryCursor
    );
    return {
        ...result,
        data: result.data.map(transformProduct)
    };
};

// Get all product registers
export const getAllProductRegisters = async (
    limit?: number,
    cursor?: number
) => {
    const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
    const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
    const result = await productRegisterRepository.getAllProductRegisters(
        queryLimit,
        queryCursor
    );
    return {
        ...result,
        data: result.data.map(transformProduct)
    };
};

// Get product register by ID
export const getProductRegisterById = async (id: number) => {
    const product = await productRegisterRepository.getProductRegisterById(id);
    if (!product) {
        throw AppError.notFound("Product register not found.");
    }
    return transformProduct(product);
};

// Search product registers by name
export const searchProductRegistersByName = async (
    searchTerm: string,
    limit?: number
) => {
    const products = await productRegisterRepository.searchProductRegistersByName(
        searchTerm.trim(),
        limit
    );
    return products.map(transformProduct);
};

export const getFilteredProducts = async (filters: any) => {
    const limit = filters.limit ? Math.floor(filters.limit) : 20;
    const cursor = filters.cursor ? Math.floor(filters.cursor) : undefined;

    const result = await productRegisterRepository.getFilteredProducts(
        {
            q: filters.q?.trim(),
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            rating: filters.rating,
            categoryId: filters.categoryId,
        },
        limit,
        cursor
    );
    return {
        ...result,
        data: result.data.map(transformProduct)
    };
};

