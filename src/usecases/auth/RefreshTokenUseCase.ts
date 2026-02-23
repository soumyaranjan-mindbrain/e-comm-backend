import { CustomerRepository } from "../../data/repositories/auth/CustomerRepository";
import AppError from "../../errors/AppError";
import jwt from "jsonwebtoken";
import config from "../../config";

export class RefreshTokenUseCase {
    constructor(private customerRepository: CustomerRepository) { }

    async execute(
        incomingRefreshToken: string,
    ): Promise<{
        user: { id: number; mobile: string; name: string };
        tokens: { accessToken: string; refreshToken: string };
    }> {
        if (!incomingRefreshToken) {
            throw AppError.unauthorized("Refresh token is missing");
        }

        let decoded: any;
        try {
            decoded = jwt.verify(incomingRefreshToken, config.jwtRefreshSecret);
        } catch (error) {
            throw AppError.unauthorized("Invalid or expired refresh token");
        }

        const userId = decoded.id;
        const customer = await this.customerRepository.findById(userId);

        if (!customer) {
            throw AppError.unauthorized("User not found");
        }

        // Verify token matches database (strict security)
        if (customer.refreshToken !== incomingRefreshToken) {
            // Possible token reuse attack! Logic could be added here to invalidate all tokens.
            throw AppError.unauthorized("Invalid refresh token");
        }

        // Generate new Link
        const newAccessToken = this.generateAccessToken(
            customer.id,
            customer.contactNo ?? "",
        );

        // Rotate Refresh Token (Extend session for another 7 days)
        const newRefreshToken = this.generateRefreshToken(customer.id);

        // Save new refresh token to DB
        await this.customerRepository.saveRefreshToken(customer.id, newRefreshToken);

        return {
            user: {
                id: customer.id,
                mobile: customer.contactNo ?? "",
                name: customer.fullName ?? "",
            },
            tokens: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
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
