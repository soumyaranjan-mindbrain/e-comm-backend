"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupUseCase = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
class SignupUseCase {
    customerRepository;
    sendOtpUseCase;
    constructor(customerRepository, sendOtpUseCase) {
        this.customerRepository = customerRepository;
        this.sendOtpUseCase = sendOtpUseCase;
    }
    async execute(input) {
        const { fullName, mobile, email } = input;
        if (!fullName || !mobile || !email) {
            throw AppError_1.default.badRequest("Full name, mobile and email are required");
        }
        // STRICT CHECK: mobile must be unique
        const existingCustomer = await this.customerRepository.findByMobile(mobile);
        if (existingCustomer) {
            throw AppError_1.default.conflict("Mobile number already registered");
        }
        // Create new customer only
        await this.customerRepository.createCustomerWithoutOtp({
            contactNo: mobile,
            fullName,
            email,
        });
        // Send OTP only for NEW signup
        await this.sendOtpUseCase.execute(mobile);
        return {
            success: true,
            message: "Signup successful. OTP sent to mobile number",
        };
    }
}
exports.SignupUseCase = SignupUseCase;
//# sourceMappingURL=SignupUseCase.js.map