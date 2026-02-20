import { CustomerRepository } from "../../data/repositories/auth/CustomerRepository";
import AppError from "../../errors/AppError";

export class LogoutUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(userId: number): Promise<{ success: boolean; msg: string }> {
    if (!userId) {
      throw AppError.unauthorized("invalid session");
    }

    await this.customerRepository.clearRefreshToken(userId);

    return {
      success: true,
      msg: "logged out successfully",
    };
  }
}
