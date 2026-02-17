import { Request, Response, NextFunction } from "express";
import * as couponCodeUseCase from "../usecases/coupon-codes/CouponCodeUseCase";

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

    const result = await couponCodeUseCase.getAllCouponCodes(limit, cursor);

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
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid coupon code ID.",
      });
      return;
    }

    const couponCode = await couponCodeUseCase.getCouponCodeById(id);

    res.status(200).json({
      success: true,
      data: couponCode,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      description,
      termsConditions,
      validCategory,
      validBrand,
      validEdition,
      validItem,
      validPrice,
      validDate,
      issuedQnty,
      receivedQnty,
      userQnty,
      createdBy,
    } = req.body;

    const couponCode = await couponCodeUseCase.createCouponCode({
      name,
      description,
      termsConditions,
      validCategory,
      validBrand,
      validEdition,
      validItem,
      validPrice,
      validDate,
      issuedQnty,
      receivedQnty,
      userQnty,
      createdBy,
    });

    res.status(201).json({
      success: true,
      message: "Coupon code created successfully.",
      data: couponCode,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid coupon code ID.",
      });
      return;
    }

    const {
      name,
      description,
      termsConditions,
      validCategory,
      validBrand,
      validEdition,
      validItem,
      validPrice,
      validDate,
      issuedQnty,
      receivedQnty,
      userQnty,
      updatedBy,
    } = req.body;

    const couponCode = await couponCodeUseCase.updateCouponCode(id, {
      name,
      description,
      termsConditions,
      validCategory,
      validBrand,
      validEdition,
      validItem,
      validPrice,
      validDate,
      issuedQnty,
      receivedQnty,
      userQnty,
      updatedBy,
    });

    res.status(200).json({
      success: true,
      message: "Coupon code updated successfully.",
      data: couponCode,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid coupon code ID.",
      });
      return;
    }

    await couponCodeUseCase.deleteCouponCode(id);

    res.status(200).json({
      success: true,
      message: "Coupon code deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const search = async (
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

    const couponCodes = await couponCodeUseCase.searchCouponCodesByName(
      searchTerm.trim(),
      limit
    );

    res.status(200).json({
      success: true,
      count: couponCodes.length,
      searchTerm: searchTerm.trim(),
      data: couponCodes,
    });
  } catch (error) {
    next(error);
  }
};
