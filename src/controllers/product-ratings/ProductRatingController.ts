import { Request, Response, NextFunction } from "express";
import * as productRatingUseCase from "../../usecases/product-ratings/ProductRatingUseCase";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;
    const cursor = req.query.cursor
      ? parseInt(req.query.cursor as string)
      : undefined;

    const result = await productRatingUseCase.getAllProductRatings(
      limit,
      cursor,
    );

    res.status(200).json({
      success: true,
      count: result.data.length,
      data: result.data,
      nextCursor: result.nextCursor,
    });
  } catch (error) {
    next(error);
  }
};

export const getByProductId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId);
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;
    const cursor = req.query.cursor
      ? parseInt(req.query.cursor as string)
      : undefined;

    if (isNaN(productId)) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
      return;
    }

    const result = await productRatingUseCase.getProductRatingsByProductId(
      productId,
      limit,
      cursor,
    );

    res.status(200).json({
      success: true,
      count: result.data.length,
      data: result.data,
      nextCursor: result.nextCursor,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const rating = await productRatingUseCase.getProductRatingById(
      parseInt(req.params.id),
    );

    res.status(200).json({
      success: true,
      data: rating,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { productId, totalRatings, givenRatings, message, createdBy } =
      req.body;

    const rating = await productRatingUseCase.createProductRating({
      productId,
      totalRatings,
      givenRatings,
      message,
      createdBy,
    });

    res.status(201).json({
      success: true,
      data: rating,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { productId, totalRatings, givenRatings, message, updatedBy } =
      req.body;

    const rating = await productRatingUseCase.updateProductRating(
      parseInt(req.params.id),
      {
        productId,
        totalRatings,
        givenRatings,
        message,
        updatedBy,
      },
    );

    res.status(200).json({
      success: true,
      data: rating,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await productRatingUseCase.deleteProductRating(parseInt(req.params.id));

    res.status(200).json({
      success: true,
      message: "Product rating deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId);

    if (isNaN(productId)) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
      return;
    }

    const stats = await productRatingUseCase.getProductRatingStats(productId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
