"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRepository = void 0;
const prisma_client_1 = __importDefault(require("../../../prisma-client"));
const client_1 = require("@prisma/client");
class CustomerRepository {
    async findByMobile(mobile) {
        return prisma_client_1.default.customer.findFirst({
            where: { contactNo: mobile },
        });
    }
    async create(data) {
        return prisma_client_1.default.customer.create({
            data: data,
        });
    }
    async findById(id) {
        return prisma_client_1.default.customer.findUnique({
            where: { id },
        });
    }
    async updateOtp(id, otp, otpValidUpto) {
        return prisma_client_1.default.customer.update({
            where: { id },
            data: {
                otp,
                otpValidUpto,
            },
        });
    }
    async saveRefreshToken(id, refreshToken) {
        return prisma_client_1.default.customer.update({
            where: { id },
            data: { refreshToken },
        });
    }
    async clearRefreshToken(id) {
        await prisma_client_1.default.customer.update({
            where: { id },
            data: { refreshToken: null },
        });
    }
    async createCustomerWithoutOtp(data) {
        const uniqueComId = Math.floor(Math.random() * 2100000000); // Max safe 32-bit integer workaround
        return prisma_client_1.default.customer.create({
            data: {
                comId: uniqueComId,
                contactNo: data.contactNo,
                fullName: data.fullName,
                emailId: data.email,
                indate: new Date(),
                status: client_1.aa13_customer_db_status.ONE,
            },
        });
    }
    async updateProfile(id, data) {
        return prisma_client_1.default.customer.update({
            where: { id },
            data: {
                fullName: data.fullName,
                emailId: data.email,
                contactNo: data.mobile,
                profileImage: data.profileImage,
                status: client_1.aa13_customer_db_status.ONE,
            },
        });
    }
}
exports.CustomerRepository = CustomerRepository;
