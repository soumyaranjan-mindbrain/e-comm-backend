import * as couponCodeRepository from "../../data/repositories/coupon-codes/CouponCodeRepository";
import AppError from "../../errors/AppError";

export const getCouponCodeById = async (id: number) => {
  const couponCode = await couponCodeRepository.getCouponCodeById(id);
  if (!couponCode) {
    throw AppError.notFound(`Coupon code with ID ${id} not found.`);
  }
  return couponCode;
};

export const getAllCouponCodes = async (limit?: number, cursor?: number) => {
  const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
  const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
  return await couponCodeRepository.getAllCouponCodes(queryLimit, queryCursor);
};

export const createCouponCode = async (
  data: couponCodeRepository.CreateCouponCodeData,
) => {
  // Validate validDate if provided
  if (data.validDate) {
    const validDate = new Date(data.validDate);
    if (isNaN(validDate.getTime())) {
      throw AppError.badRequest("Invalid valid date format.");
    }
    // Check if validDate is in the past (compare dates at start of day to avoid timezone issues)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const validDateStart = new Date(validDate);
    validDateStart.setHours(0, 0, 0, 0);
    if (validDateStart < today) {
      throw AppError.badRequest("Valid date cannot be in the past.");
    }
  }

  // Validate quantities are non-negative
  if (data.issuedQnty !== undefined && data.issuedQnty < 0) {
    throw AppError.badRequest("Issued quantity cannot be negative.");
  }
  if (data.receivedQnty !== undefined && data.receivedQnty < 0) {
    throw AppError.badRequest("Received quantity cannot be negative.");
  }
  if (data.userQnty !== undefined && data.userQnty < 0) {
    throw AppError.badRequest("User quantity cannot be negative.");
  }

  // Validate validPrice is non-negative
  if (data.validPrice !== undefined && data.validPrice < 0) {
    throw AppError.badRequest("Valid price cannot be negative.");
  }

  return await couponCodeRepository.createCouponCode(data);
};

export const updateCouponCode = async (
  id: number,
  data: couponCodeRepository.UpdateCouponCodeData,
) => {
  // Check if coupon code exists
  const existingCouponCode = await couponCodeRepository.getCouponCodeById(id);
  if (!existingCouponCode) {
    throw AppError.notFound(`Coupon code with ID ${id} not found.`);
  }

  // Validate validDate if provided
  if (data.validDate) {
    const validDate = new Date(data.validDate);
    if (isNaN(validDate.getTime())) {
      throw AppError.badRequest("Invalid valid date format.");
    }
    // Check if validDate is in the past (compare dates at start of day to avoid timezone issues)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const validDateStart = new Date(validDate);
    validDateStart.setHours(0, 0, 0, 0);
    if (validDateStart < today) {
      throw AppError.badRequest("Valid date cannot be in the past.");
    }
  }

  // Validate quantities are non-negative
  if (data.issuedQnty !== undefined && data.issuedQnty < 0) {
    throw AppError.badRequest("Issued quantity cannot be negative.");
  }
  if (data.receivedQnty !== undefined && data.receivedQnty < 0) {
    throw AppError.badRequest("Received quantity cannot be negative.");
  }
  if (data.userQnty !== undefined && data.userQnty < 0) {
    throw AppError.badRequest("User quantity cannot be negative.");
  }

  // Validate validPrice is non-negative
  if (data.validPrice !== undefined && data.validPrice < 0) {
    throw AppError.badRequest("Valid price cannot be negative.");
  }

  return await couponCodeRepository.updateCouponCode(id, data);
};

export const deleteCouponCode = async (id: number) => {
  const existingCouponCode = await couponCodeRepository.getCouponCodeById(id);
  if (!existingCouponCode) {
    throw AppError.notFound(`Coupon code with ID ${id} not found.`);
  }

  return await couponCodeRepository.deleteCouponCode(id);
};

export const searchCouponCodesByName = async (
  searchTerm: string,
  limit?: number,
) => {
  if (!searchTerm || searchTerm.trim() === "") {
    throw AppError.badRequest("Search term is required.");
  }
  return await couponCodeRepository.searchCouponCodesByName(searchTerm, limit);
};
