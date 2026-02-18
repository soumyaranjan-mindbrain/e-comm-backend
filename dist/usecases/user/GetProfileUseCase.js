"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProfileUseCase = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
class GetProfileUseCase {
    customerRepository;
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }
    async execute(userId) {
        const user = await this.customerRepository.findById(userId);
        if (!user) {
            throw AppError_1.default.notFound("user not found");
        }
        return {
            id: user.id,
            fullName: user.fullName,
            email: user.emailId,
            mobile: user.contactNo,
            profileImage: user.profileImage,
        };
    }
}
exports.GetProfileUseCase = GetProfileUseCase;
