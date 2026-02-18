"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendOtpUseCase = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const crypto_1 = require("../../util/crypto");
const config_1 = __importDefault(require("../../config"));
const mailer_1 = require("../../services/mailer");
class SendOtpUseCase {
    customerRepository;
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }
    async execute(mobile) {
        if (!mobile) {
            throw AppError_1.default.badRequest("mobile number is required");
        }
        // Check if user exists (Sushree's logic: signup required)
        const customer = await this.customerRepository.findByMobile(mobile);
        if (!customer) {
            throw AppError_1.default.notFound("mobile number not registered. please signup first.");
        }
        // Check for active OTP (Rate limiting)
        if (customer.otpValidUpto && customer.otpValidUpto > new Date()) {
            throw AppError_1.default.tooManyRequests("otp already sent. please wait before requesting again.");
        }
        // Generate OTP
        const otp = (config_1.default.env === "development" || config_1.default.env === "dev") ? "111111" : (0, crypto_1.generateOtp)();
        // Hash OTP before storing
        const hashedOtp = await (0, crypto_1.hashOtp)(otp);
        const otpValidUpto = new Date(Date.now() + 10 * 60000); // 10 minutes
        await this.customerRepository.updateOtp(customer.id, hashedOtp, otpValidUpto);
        // Send OTP via Email if email exists
        if (customer.emailId) {
            try {
                await mailer_1.mailer.send({
                    to: customer.emailId,
                    subject: "Your BM2MALL Login OTP",
                    text: `Your OTP for login is ${otp}. It is valid for 10 minutes.`,
                    html: `<p>Your OTP for login is <b>${otp}</b>. It is valid for 10 minutes.</p>`
                });
            }
            catch (err) {
                console.error("Failed to send OTP email:", err);
            }
        }
        // Mock SMS
        console.log(`[MOCK SMS] OTP for ${mobile} is ${otp}`);
        return {
            success: true,
            message: "otp sent successfully",
        };
    }
}
exports.SendOtpUseCase = SendOtpUseCase;
