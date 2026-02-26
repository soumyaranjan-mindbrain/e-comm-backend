"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.logout = exports.signup = exports.verifyOtp = exports.sendOtp = void 0;
const CustomerRepository_1 = require("../../data/repositories/auth/CustomerRepository");
const SendOtpUseCase_1 = require("../../usecases/auth/SendOtpUseCase");
const VerifyOtpUseCase_1 = require("../../usecases/auth/VerifyOtpUseCase");
const SignupUseCase_1 = require("../../usecases/auth/SignupUseCase");
const LogoutUseCase_1 = require("../../usecases/auth/LogoutUseCase");
const RefreshTokenUseCase_1 = require("../../usecases/auth/RefreshTokenUseCase");
const config_1 = __importDefault(require("../../config"));
const customerRepository = new CustomerRepository_1.CustomerRepository();
const sendOtpUseCase = new SendOtpUseCase_1.SendOtpUseCase(customerRepository);
const verifyOtpUseCase = new VerifyOtpUseCase_1.VerifyOtpUseCase(customerRepository);
const signupUseCase = new SignupUseCase_1.SignupUseCase(customerRepository, sendOtpUseCase);
const logoutUseCase = new LogoutUseCase_1.LogoutUseCase(customerRepository);
const refreshTokenUseCase = new RefreshTokenUseCase_1.RefreshTokenUseCase(customerRepository);
const sendOtp = async (req, res, next) => {
    try {
        const { mobile } = req.body;
        const result = await sendOtpUseCase.execute(mobile);
        res.status(200).json({
            success: true,
            message: result.message.toLowerCase(),
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.sendOtp = sendOtp;
const verifyOtp = async (req, res, next) => {
    try {
        const { mobile, otp } = req.body;
        const result = await verifyOtpUseCase.execute(mobile, otp);
        const isProduction = config_1.default.env === "production";
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
            message: "otp verified successfully",
            data: {
                user: result.user,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyOtp = verifyOtp;
const signup = async (req, res, next) => {
    try {
        const { fullName, mobile, email } = req.body;
        const result = await signupUseCase.execute({ fullName, mobile, email });
        res.status(201).json({
            success: true,
            message: result.message.toLowerCase(),
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.signup = signup;
const logout = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const result = await logoutUseCase.execute(userId);
        // Clear Cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({
            ...result,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
const refreshToken = async (req, res, next) => {
    try {
        const incomingToken = req.cookies.refreshToken || req.body.refreshToken;
        const result = await refreshTokenUseCase.execute(incomingToken);
        const isProduction = config_1.default.env === "production";
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
            message: "token refreshed successfully",
            data: {
                user: result.user,
            },
        });
    }
    catch (error) {
        next(error); // This will handle Expired/Invalid token errors appropriately
    }
};
exports.refreshToken = refreshToken;
