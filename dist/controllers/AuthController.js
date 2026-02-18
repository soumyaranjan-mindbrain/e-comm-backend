"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.verifyOtp = exports.sendOtp = void 0;
const CustomerRepository_1 = require("../data/repositories/CustomerRepository");
const SendOtpUseCase_1 = require("../usecases/auth/SendOtpUseCase");
const VerifyOtpUseCase_1 = require("../usecases/auth/VerifyOtpUseCase");
const SignupUseCase_1 = require("../usecases/auth/SignupUseCase");
const customerRepository = new CustomerRepository_1.CustomerRepository();
const sendOtpUseCase = new SendOtpUseCase_1.SendOtpUseCase(customerRepository);
const verifyOtpUseCase = new VerifyOtpUseCase_1.VerifyOtpUseCase(customerRepository);
const signupUseCase = new SignupUseCase_1.SignupUseCase(customerRepository, sendOtpUseCase);
const sendOtp = async (req, res, next) => {
    try {
        const { mobile } = req.body;
        const result = await sendOtpUseCase.execute(mobile);
        res.status(200).json({
            success: true,
            message: result.message,
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
        res.status(200).json({
            success: true,
            message: "Login successful.",
            data: result,
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
            message: result.message,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.signup = signup;
//# sourceMappingURL=AuthController.js.map