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
        // 2. Mobile number cannot be updated via this API
        // if (data.mobile && data.mobile !== user.contactNo) { ... }
        // 3. Update profile
        const updatedUser = await this.customerRepository.updateProfile(userId, {
            fullName: data.fullName,
            email: data.email,
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
//# sourceMappingURL=UpdateProfileUseCase.js.map