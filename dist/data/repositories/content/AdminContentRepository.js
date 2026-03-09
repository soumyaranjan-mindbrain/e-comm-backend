"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminContentRepository = void 0;
const prisma_client_1 = __importDefault(require("../../../prisma-client"));
class AdminContentRepository {
    async getContentBySlug(slug) {
        return prisma_client_1.default.appContent.findUnique({
            where: { slug },
        });
    }
    async saveEnquiry(data) {
        return prisma_client_1.default.enquiry.create({
            data: {
                ...data,
                status: 'PENDING'
            },
        });
    }
}
exports.AdminContentRepository = AdminContentRepository;
