import prisma from "../../prisma-client";
import { CouponCode as PrismaCouponCode, Prisma } from "@prisma/client";

export interface CursorPaginationResult<T> {
  data: T[];
  nextCursor: number | null;
}

export interface CreateCouponCodeData {
  name?: string;
  description?: string;
  termsConditions?: string;
  validCategory?: string;
  validBrand?: string;
  validEdition?: string;
  validItem?: string;
  validPrice?: number;
  validDate?: Date | string;
  issuedQnty?: number;
  receivedQnty?: number;
  userQnty?: number;
  createdBy?: number;
}

export interface UpdateCouponCodeData {
  name?: string;
  description?: string;
  termsConditions?: string;
  validCategory?: string;
  validBrand?: string;
  validEdition?: string;
  validItem?: string;
  validPrice?: number;
  validDate?: Date | string;
  issuedQnty?: number;
  receivedQnty?: number;
  userQnty?: number;
  updatedBy?: number;
}

export const getCouponCodeById = async (
  id: number
): Promise<PrismaCouponCode | null> => {
  return prisma.couponCode.findUnique({
    where: { id },
  });
};

export const getAllCouponCodes = async (
  limit: number = 20,
  cursor?: number
): Promise<CursorPaginationResult<PrismaCouponCode>> => {
  const take = limit + 1;

  const couponCodes = await prisma.couponCode.findMany({
    where: cursor ? { id: { lt: cursor } } : undefined,
    orderBy: { createdAt: "desc" },
    take,
  });

  const hasMore = couponCodes.length > limit;
  const data = hasMore ? couponCodes.slice(0, limit) : couponCodes;
  const nextCursor =
    hasMore && data.length > 0 ? data[data.length - 1].id : null;

  return { data, nextCursor };
};

export const createCouponCode = async (
  data: CreateCouponCodeData
): Promise<PrismaCouponCode> => {
  return prisma.couponCode.create({
    data: {
      name: data.name,
      description: data.description,
      termsConditions: data.termsConditions,
      validCategory: data.validCategory,
      validBrand: data.validBrand,
      validEdition: data.validEdition,
      validItem: data.validItem,
      validPrice: data.validPrice,
      validDate: data.validDate ? new Date(data.validDate) : null,
      issuedQnty: data.issuedQnty,
      receivedQnty: data.receivedQnty,
      userQnty: data.userQnty,
      createdBy: data.createdBy,
    },
  });
};

export const updateCouponCode = async (
  id: number,
  data: UpdateCouponCodeData
): Promise<PrismaCouponCode> => {
  return prisma.couponCode.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      termsConditions: data.termsConditions,
      validCategory: data.validCategory,
      validBrand: data.validBrand,
      validEdition: data.validEdition,
      validItem: data.validItem,
      validPrice: data.validPrice,
      validDate: data.validDate ? new Date(data.validDate) : undefined,
      issuedQnty: data.issuedQnty,
      receivedQnty: data.receivedQnty,
      userQnty: data.userQnty,
      updatedBy: data.updatedBy,
      updatedAt: new Date(),
    },
  });
};

export const deleteCouponCode = async (
  id: number
): Promise<PrismaCouponCode> => {
  return prisma.couponCode.delete({
    where: { id },
  });
};

export const searchCouponCodesByName = async (
  searchTerm: string,
  limit?: number
): Promise<PrismaCouponCode[]> => {
  const queryLimit = limit && limit > 0 ? Math.floor(limit) : undefined;
  const trimmedSearchTerm = searchTerm.trim();

  const couponCodes = await prisma.couponCode.findMany({
    where: {
      name: {
        contains: trimmedSearchTerm,
      },
    },
    orderBy: { createdAt: "desc" },
    ...(queryLimit && { take: queryLimit }),
  });

  return couponCodes;
};
