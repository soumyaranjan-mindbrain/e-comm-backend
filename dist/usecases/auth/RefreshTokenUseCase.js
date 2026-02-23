"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenUseCase = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
class RefreshTokenUseCase {
    customerRepository;
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }
    async execute(incomingRefreshToken) {
        if (!incomingRefreshToken) {
            throw AppError_1.default.unauthorized("Refresh token is missing");
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(incomingRefreshToken, config_1.default.jwtRefreshSecret);
        }
        catch (error) {
            throw AppError_1.default.unauthorized("Invalid or expired refresh token");
        }
        const userId = decoded.id;
        const customer = await this.customerRepository.findById(userId);
        if (!customer) {
            throw AppError_1.default.unauthorized("User not found");
        }
        // Verify token matches database (strict security)
        if (customer.refreshToken !== incomingRefreshToken) {
            // Possible token reuse attack! Logic could be added here to invalidate all tokens.
            throw AppError_1.default.unauthorized("Invalid refresh token");
        }
        // Generate new Link
        const newAccessToken = this.generateAccessToken(customer.id, customer.contactNo ?? "");
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
    generateAccessToken(id, mobile) {
        return jsonwebtoken_1.default.sign({ id, mobile }, config_1.default.jwtAccessSecret, {
            expiresIn: "15m",
        });
    }
    generateRefreshToken(id) {
        return jsonwebtoken_1.default.sign({ id }, config_1.default.jwtRefreshSecret, { expiresIn: "7d" });
    }
}
exports.RefreshTokenUseCase = RefreshTokenUseCase;
//# sourceMappingURL=RefreshTokenUseCase.js.map