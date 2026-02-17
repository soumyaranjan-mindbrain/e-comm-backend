import prisma from "../../prisma-client";
import { Customer } from "@prisma/client";

export class CustomerRepository {
    async findByMobile(mobile: string): Promise<Customer | null> {
        return prisma.customer.findFirst({
            where: { contactNo: mobile },
        });
    }

    async create(data: Partial<Customer>): Promise<Customer> {
        return prisma.customer.create({
            data: data as any,
        });
    }

    async findById(id: number): Promise<Customer | null> {
        return prisma.customer.findUnique({
            where: { id },
        });
    }

    async updateOtp(
        id: number,
        otp: string,
        otpValidUpto: Date,
    ): Promise<Customer> {
        return prisma.customer.update({
            where: { id },
            data: {
                otp,
                otpValidUpto,
            },
        });
    }
}
