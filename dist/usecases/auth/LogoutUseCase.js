"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutUseCase = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
class LogoutUseCase {
    customerRepository;
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }
    async execute(userId) {
        if (!userId) {
            throw AppError_1.default.unauthorized("invalid session");
        }
        await this.customerRepository.clearRefreshToken(userId);
        return {
            success: true,
            msg: "logged out successfully",
        };
    }
}
exports.LogoutUseCase = LogoutUseCase;
