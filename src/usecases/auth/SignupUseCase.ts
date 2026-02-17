import { CustomerRepository } from "../../data/repositories/CustomerRepository";
import AppError from "../../errors/AppError";
import { SendOtpUseCase } from "./SendOtpUseCase";

interface SignupInput {
    fullName: string;
    mobile: string;
    email: string;
}

export class SignupUseCase {
    constructor(
        private customerRepository: CustomerRepository,
        private sendOtpUseCase: SendOtpUseCase,
    ) { }

    async execute(input: SignupInput): Promise<{
        success: boolean;
        message: string;
    }> {
        const { fullName, mobile, email } = input;

        if (!fullName || !mobile || !email) {
            throw AppError.badRequest("Full name, mobile and email are required");
        }

        // STRICT CHECK: mobile must be unique
        const existingCustomer = await this.customerRepository.findByMobile(mobile);

        if (existingCustomer) {
            throw AppError.conflict("Mobile number already registered");
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
