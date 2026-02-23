import * as productRatingRepository from "../../data/repositories/product-ratings/ProductRatingRepository";
import AppError from "../../errors/AppError";

export const getProductRatingById = async (id: number) => {
  const rating = await productRatingRepository.getProductRatingById(id);
  if (!rating) {
    throw AppError.notFound("Product rating not found.");
  }
  return rating;
};

export const getProductRatingsByProductId = async (
  productId: number,
  limit?: number,
  cursor?: number,
) => {
  const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
  const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
  return await productRatingRepository.getProductRatingsByProductId(
    productId,
    queryLimit,
    queryCursor,
  );
};

export const getAllProductRatings = async (limit?: number, cursor?: number) => {
  const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
  const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
  return await productRatingRepository.getAllProductRatings(
    queryLimit,
    queryCursor,
  );
};

export const createProductRating = async (
  data: productRatingRepository.CreateProductRatingData,
) => {
  // Validate that givenRatings is within valid range (typically 1-5)
  if (data.givenRatings !== undefined) {
    if (data.givenRatings < 1 || data.givenRatings > 5) {
      throw AppError.badRequest("Given rating must be between 1 and 5.");
    }
  }

  return await productRatingRepository.createProductRating(data);
};

export const updateProductRating = async (
  id: number,
  data: productRatingRepository.UpdateProductRatingData,
) => {
  // Check if rating exists
  const existingRating = await productRatingRepository.getProductRatingById(id);
  if (!existingRating) {
    throw AppError.notFound("Product rating not found.");
  }

  // Validate that givenRatings is within valid range (typically 1-5)
  if (data.givenRatings !== undefined) {
    if (data.givenRatings < 1 || data.givenRatings > 5) {
      throw AppError.badRequest("Given rating must be between 1 and 5.");
    }
  }

  return await productRatingRepository.updateProductRating(id, data);
};

export const deleteProductRating = async (id: number) => {
  const existingRating = await productRatingRepository.getProductRatingById(id);
  if (!existingRating) {
    throw AppError.notFound("Product rating not found.");
  }

  return await productRatingRepository.deleteProductRating(id);
};

export const getProductRatingStats = async (productId: number) => {
  return await productRatingRepository.getProductRatingStats(productId);
};
