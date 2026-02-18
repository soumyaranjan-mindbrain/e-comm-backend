import { CustomerRepository } from "../../data/repositories/CustomerRepository";
import AppError from "../../errors/AppError";
import { generateOtp, hashOtp } from "../../util/crypto";
import config from "../../config";
import { mailer } from "../../services/mailer";

export class SendOtpUseCase {
    constructor(private customerRepository: CustomerRepository) { }

    async execute(mobile: string): Promise<{ success: boolean; message: string }> {
        if (!mobile) {
            throw AppError.badRequest("mobile number is required");
        }

        // Check if user exists (Sushree's logic: signup required)
        const customer = await this.customerRepository.findByMobile(mobile);

        if (!customer) {
            throw AppError.notFound("mobile number not registered. please signup first.");
        }

        // Check for active OTP (Rate limiting)
        if (customer.otpValidUpto && customer.otpValidUpto > new Date()) {
            throw AppError.tooManyRequests("otp already sent. please wait before requesting again.");
        }

        // Generate OTP
        const otp = (config.env === "development" || config.env === "dev") ? "111111" : generateOtp();

        // Hash OTP before storing
        const hashedOtp = await hashOtp(otp);
        const otpValidUpto = new Date(Date.now() + 10 * 60000); // 10 minutes

        await this.customerRepository.updateOtp(customer.id, hashedOtp, otpValidUpto);

        // Send OTP via Email if email exists
        if (customer.emailId) {
            try {
                await mailer.send({
                    to: customer.emailId,
                    subject: "Your BM2MALL Login OTP",
                    text: `Your OTP for login is ${otp}. It is valid for 10 minutes.`,
                    html: `<p>Your OTP for login is <b>${otp}</b>. It is valid for 10 minutes.</p>`
                });
            } catch (err) {
                console.error("Failed to send OTP email:", err);
            }
        }

        // Mock SMS
        console.log(`[MOCK SMS] OTP for ${mobile} is ${otp}`);

        return {
            success: true,
            message: "otp sent successfully",
        };
    }

}
