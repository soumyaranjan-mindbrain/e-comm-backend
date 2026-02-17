import { CustomerRepository } from "../../data/repositories/CustomerRepository";
import AppError from "../../errors/AppError";
import jwt from "jsonwebtoken";
import config from "../../config";

export class VerifyOtpUseCase {
    constructor(private customerRepository: CustomerRepository) { }

    async execute(
        mobile: string,
        otp: string,
    ): Promise<{
        user: { id: number; mobile: string; name: string };
        tokens: { accessToken: string; refreshToken: string };
    }> {
        if (!mobile || !otp) {
            throw AppError.badRequest("Mobile number and OTP are required");
        }

        const customer = await this.customerRepository.findByMobile(mobile);

        if (!customer) {
            throw AppError.notFound("User not found");
        }

        if (customer.otp !== otp) {
            throw AppError.badRequest("Invalid OTP");
        }

        if (customer.otpValidUpto && new Date() > customer.otpValidUpto) {
            throw AppError.badRequest("OTP has expired");
        }

        // Clear OTP after successful verification (optional, ensures one-time use)
        // await this.customerRepository.updateOtp(customer.id, null, null); 

        const accessToken = this.generateAccessToken(customer.id, customer.contactNo ?? "");
        const refreshToken = this.generateRefreshToken(customer.id);

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

    private generateAccessToken(id: number, mobile: string): string {
        return jwt.sign({ id, mobile }, config.jwtAccessSecret, {
            expiresIn: "15m",
        });
    }

    private generateRefreshToken(id: number): string {
        return jwt.sign({ id }, config.jwtRefreshSecret, { expiresIn: "7d" });
    }
}
