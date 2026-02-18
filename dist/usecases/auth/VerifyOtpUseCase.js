"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyOtpUseCase = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const crypto_1 = require("../../util/crypto");
class VerifyOtpUseCase {
    customerRepository;
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }
    async execute(mobile, otpInput) {
        if (!mobile || !otpInput) {
            throw AppError_1.default.badRequest("Mobile number and OTP are required");
        }
        const customer = await this.customerRepository.findByMobile(mobile);
        if (!customer) {
            throw AppError_1.default.notFound("User not found");
        }
        if (!customer.otp || !customer.otpValidUpto) {
            throw AppError_1.default.badRequest("OTP not generated");
        }
        if (new Date() > customer.otpValidUpto) {
            throw AppError_1.default.badRequest("OTP has expired");
        }
        // Validate OTP (Hashing support)
        let isValidOtp = false;
        if (config_1.default.env === "development" && otpInput === "111111") {
            isValidOtp = true;
        }
        else {
            isValidOtp = await (0, crypto_1.compareOtp)(otpInput, customer.otp);
        }
        if (!isValidOtp) {
            throw AppError_1.default.badRequest("Invalid OTP");
        }
        // Clear OTP immediately after successful verification
        await this.customerRepository.updateOtp(customer.id, null, null);
        const accessToken = this.generateAccessToken(customer.id, customer.contactNo ?? "");
        const refreshToken = this.generateRefreshToken(customer.id);
        // Save refresh token to database
        await this.customerRepository.saveRefreshToken(customer.id, refreshToken);
        return {
            user: {
                id: customer.id,
                mobile: customer.contactNo ?? "",
                name: customer.fullName ?? "",
            },
            tokens: {
                accessToken,
                refreshToken,
            },
        };
    }
    generateAccessToken(id, mobile) {
        return jsonwebtoken_1.default.sign({ id, mobile }, config_1.default.jwtAccessSecret, {
            expiresIn: "15m",
        });
    }
    generateRefreshToken(id) {
        return jsonwebtoken_1.default.sign({ id }, config_1.default.jwtRefreshSecret, { expiresIn: "7d" });
    }
}
exports.VerifyOtpUseCase = VerifyOtpUseCase;
//# sourceMappingURL=VerifyOtpUseCase.js.map