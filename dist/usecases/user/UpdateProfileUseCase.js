"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileUseCase = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
class UpdateProfileUseCase {
    customerRepository;
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }
    async execute(userId, data) {
        // 1. Check if user exists
        const user = await this.customerRepository.findById(userId);
        if (!user) {
            throw AppError_1.default.notFound("user not found");
        }
        // 2. If mobile is being updated, check for uniqueness
        if (data.mobile && data.mobile !== user.contactNo) {
            const existingUser = await this.customerRepository.findByMobile(data.mobile);
            if (existingUser) {
                throw AppError_1.default.conflict("mobile number already in use by another account");
            }
        }
        // 3. Update profile
        const updatedUser = await this.customerRepository.updateProfile(userId, {
            fullName: data.fullName,
            email: data.email,
            mobile: data.mobile,
            profileImage: data.profileImage,
        });
        return {
            id: updatedUser.id,
            fullName: updatedUser.fullName,
            email: updatedUser.emailId,
            mobile: updatedUser.contactNo,
            profileImage: updatedUser.profileImage,
        };
    }
}
exports.UpdateProfileUseCase = UpdateProfileUseCase;
