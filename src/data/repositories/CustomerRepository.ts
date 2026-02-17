import prisma from "../../prisma-client";
import { Customer, aa13_customer_db_status } from "@prisma/client";

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
        otp: string | null,
        otpValidUpto: Date | null,
    ): Promise<Customer> {
        return prisma.customer.update({
            where: { id },
            data: {
                otp,
                otpValidUpto,
            },
        });
    }

    async saveRefreshToken(id: number, refreshToken: string): Promise<Customer> {
        return prisma.customer.update({
            where: { id },
            data: { refreshToken },
        });
    }

    async createCustomerWithoutOtp(data: {
        contactNo: string;
        fullName: string;
        email: string;
    }): Promise<Customer> {
        return prisma.customer.create({
            data: {
                contactNo: data.contactNo,
                fullName: data.fullName,
                emailId: data.email,
                indate: new Date(),
                status: aa13_customer_db_status.ONE,
            },
        });
    }

    async updateProfile(id: number, data: { fullName?: string; email?: string }): Promise<Customer> {
        return prisma.customer.update({
            where: { id },
            data: {
                fullName: data.fullName,
                emailId: data.email,
                status: aa13_customer_db_status.ONE,
            },
        });
    }
}
