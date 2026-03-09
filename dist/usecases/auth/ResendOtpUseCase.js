"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendOtpUseCase = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const crypto_1 = require("../../util/crypto");
const config_1 = __importDefault(require("../../config"));
const mailer_1 = require("../../services/mailer");
class ResendOtpUseCase {
    customerRepository;
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }
    async execute(mobileInput) {
        const mobile = mobileInput?.trim();
        if (!mobile) {
            throw AppError_1.default.badRequest("mobile number is required");
        }
        const customer = await this.customerRepository.findByMobile(mobile);
        if (!customer) {
            throw AppError_1.default.notFound("user not found");
        }
        //  STRICT RATE LIMIT (60 seconds)
        if (customer.otpValidUpto) {
            const timeSinceLastOtp = Date.now() - (customer.otpValidUpto.getTime() - 10 * 60000);
            if (timeSinceLastOtp < 60 * 1000) {
                throw AppError_1.default.tooManyRequests("please wait 60 seconds before requesting a new otp");
            }
        }
        const otp = config_1.default.env === "development" || config_1.default.env === "dev"
            ? "111111"
            : (0, crypto_1.generateOtp)();
        const hashedOtp = (0, crypto_1.hashOtp)(otp);
        const otpValidUpto = new Date(Date.now() + 10 * 60000);
        await this.customerRepository.updateOtp(customer.id, hashedOtp, otpValidUpto);
        if (customer.emailId) {
            try {
                await mailer_1.mailer.send({
                    to: customer.emailId,
                    subject: "Your BM2MALL OTP (Resend)",
                    text: `Your new OTP is ${otp}. It is valid for 10 minutes.`,
                    html: `<p>Your new OTP is <b>${otp}</b>. It is valid for 10 minutes.</p>`,
                });
            }
            catch (err) {
                console.error("Failed to send resend OTP email:", err);
            }
        }
        console.log(`[MOCK SMS] Resend OTP for ${mobile} is ${otp}`);
        return {
            success: true,
            message: "otp resent successfully",
        };
    }
}
exports.ResendOtpUseCase = ResendOtpUseCase;
