import { CustomerRepository } from "../../data/repositories/CustomerRepository";
import AppError from "../../errors/AppError";

interface UpdateProfileInput {
    fullName?: string;
    email?: string;
    mobile?: string;
    profileImage?: string;
}

export class UpdateProfileUseCase {
    constructor(private customerRepository: CustomerRepository) { }

    async execute(userId: number, data: UpdateProfileInput) {
        // 1. Check if user exists
        const user = await this.customerRepository.findById(userId);
        if (!user) {
            throw AppError.notFound("user not found");
        }

        // 2. If mobile is being updated, check for uniqueness
        if (data.mobile && data.mobile !== user.contactNo) {
            const existingUser = await this.customerRepository.findByMobile(data.mobile);
            if (existingUser) {
                throw AppError.conflict("mobile number already in use by another account");
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
            profileImage: (updatedUser as any).profileImage,
        };

    }
}

