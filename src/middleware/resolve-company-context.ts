import { NextFunction, Response } from "express";
import prisma from "../prisma-client";
import { AuthRequest } from "./authenticate-user";

const COMPANY_CONTEXT_ERROR = {
  success: false,
  message: "user identity could not be verified",
};

export default async function resolveCompanyContext(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.companyContext?.comId) {
      next();
      return;
    }

    let comId = req.user?.comId;
    if (!comId && req.user?.id) {
      console.log(
        `WARNING: comId missing in token for user ${req.user.id}. Falling back to db lookup.`,
      );
      const customer = await prisma.customer.findUnique({
        where: { id: req.user.id },
      });
      comId = customer?.comId || req.user.id;
    }

    if (!comId) {
      res.status(500).json(COMPANY_CONTEXT_ERROR);
      return;
    }

    req.companyContext = { comId };
    next();
  } catch (error) {
    next(error);
  }
}
