import { Response, NextFunction, Request } from "express";
import { CustomerRepository } from "../data/repositories/CustomerRepository";
import { SendOtpUseCase } from "../usecases/auth/SendOtpUseCase";
import { VerifyOtpUseCase } from "../usecases/auth/VerifyOtpUseCase";
import { SignupUseCase } from "../usecases/auth/SignupUseCase";
import { LogoutUseCase } from "../usecases/auth/LogoutUseCase";
import config from "../config";


const customerRepository = new CustomerRepository();
const sendOtpUseCase = new SendOtpUseCase(customerRepository);
const verifyOtpUseCase = new VerifyOtpUseCase(customerRepository);
const signupUseCase = new SignupUseCase(customerRepository, sendOtpUseCase);
const logoutUseCase = new LogoutUseCase(customerRepository);

export const sendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { mobile } = req.body;
    const result = await sendOtpUseCase.execute(mobile);

    res.status(200).json({
      success: true,
      msg: result.message.toLowerCase(),
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { mobile, otp } = req.body;
    const result = await verifyOtpUseCase.execute(mobile, otp);

    const isProduction = config.env === "production";

    // Set Access Token Cookie (15 Minutes)
    res.cookie("accessToken", result.tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    // Set Refresh Token Cookie (7 Days)
    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      msg: "otp verified successfully",
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { fullName, mobile, email } = req.body;
    const result = await signupUseCase.execute({ fullName, mobile, email });

    res.status(201).json({
      success: true,
      msg: result.message.toLowerCase(),
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const result = await logoutUseCase.execute(userId);

    // Clear Cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      ...result,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};


