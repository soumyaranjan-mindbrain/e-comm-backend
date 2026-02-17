import { CustomerRepository } from "../../data/repositories/CustomerRepository";
import AppError from "../../errors/AppError";
import { aa13_customer_db_status } from "@prisma/client";

export class SendOtpUseCase {
    constructor(private customerRepository: CustomerRepository) { }

    async execute(mobile: string): Promise<{ success: boolean; message: string }> {
        if (!mobile) {
            throw AppError.badRequest("Mobile number is required");
        }

        // Generate 6-digit OTP
        const otp = "111111"; // Fixed for now
        const otpValidUpto = new Date(Date.now() + 10 * 60000); // 10 minutes

        let customer = await this.customerRepository.findByMobile(mobile);

        if (!customer) {
            // Create new customer if not exists (or we can decide to only allow existing customers)
            // For this refactor, let's assume auto-registration or just create a record
            customer = await this.customerRepository.create({
                contactNo: mobile,
                otp,
                otpValidUpto,
                status: aa13_customer_db_status.ONE,
            });
        } else {
            await this.customerRepository.updateOtp(customer.id, otp, otpValidUpto);
        }

        // Mock sending SMS
        console.log(`[MOCK SMS] OTP for ${mobile} is ${otp}`);

        return {
            success: true,
            message: "OTP sent successfully",
        };
    }
}
