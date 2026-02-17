import { Response, NextFunction, Request } from "express";
import { CustomerRepository } from "../data/repositories/CustomerRepository";
import { SendOtpUseCase } from "../usecases/auth/SendOtpUseCase";
import { VerifyOtpUseCase } from "../usecases/auth/VerifyOtpUseCase";

const customerRepository = new CustomerRepository();
const sendOtpUseCase = new SendOtpUseCase(customerRepository);
const verifyOtpUseCase = new VerifyOtpUseCase(customerRepository);

export const sendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { mobile } = req.body;
    const result = await sendOtpUseCase.execute(mobile);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { mobile, otp } = req.body;
    const result = await verifyOtpUseCase.execute(mobile, otp);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
