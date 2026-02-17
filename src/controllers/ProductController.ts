import { Request, Response, NextFunction } from "express";
import * as productUseCase from "../usecases/products/ProductUseCase";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Use res.locals.validatedQuery if available (from validateRequest middleware), otherwise req.query
    const queryData = res.locals.validatedQuery || req.query;
    const { slugs, q, minPrice, maxPrice, rating, categoryId, limit, cursor } = queryData;

    let result;

    if (slugs === "new-arrivals") {
      result = await productUseCase.getNewArrivals(
        limit ? parseInt(limit as string) : undefined,
        cursor ? parseInt(cursor as string) : undefined
      );
    } else if (slugs) {
      result = await productUseCase.getProductsByCategorySlug(
        slugs as string,
        limit ? parseInt(limit as string) : undefined,
        cursor ? parseInt(cursor as string) : undefined
      );
    } else if (q || minPrice || maxPrice || rating || categoryId) {
      result = await productUseCase.getFilteredProducts({
        q,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        rating: rating ? parseFloat(rating as string) : undefined,
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        cursor: cursor ? parseInt(cursor as string) : undefined,
      });
    } else {
      result = await productUseCase.getAllProductRegisters(
        limit ? parseInt(limit as string) : undefined,
        cursor ? parseInt(cursor as string) : undefined
      );
    }

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

export const searchProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const searchTerm = req.query.q as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    if (!searchTerm || searchTerm.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Search term is required. Please provide 'q' query parameter.",
      });
      return;
    }

    const products = await productUseCase.searchProductRegistersByName(
      searchTerm.trim(),
      limit
    );

    res.status(200).json({
      success: true,
      count: products.length,
      searchTerm: searchTerm.trim(),
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await productUseCase.getProductRegisterById(
      parseInt(req.params.id)
    );

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
