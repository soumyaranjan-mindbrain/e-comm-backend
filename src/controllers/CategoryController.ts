import { Request, Response, NextFunction } from "express";
import * as categoryUseCase from "../usecases/categories/CategoryUseCase";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;
    const cursor = req.query.cursor
      ? parseInt(req.query.cursor as string)
      : undefined;
    const search = req.query.q as string | undefined;

    const result = await categoryUseCase.getAllCategories(limit, cursor, search);

    res.status(200).json({
      success: true,
      count: result.totalCount,
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
  next: NextFunction
): Promise<void> => {
  try {
    const category = await categoryUseCase.getCategoryById(
      parseInt(req.params.id)
    );

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};
