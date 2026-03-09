"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqRepository = void 0;
const prisma_client_1 = __importDefault(require("../../../prisma-client"));
class FaqRepository {
    async getAllFaqs() {
        return prisma_client_1.default.faq.findMany({
            where: { isActive: true },
            orderBy: [{ priority: "desc" }, { id: "asc" }],
        });
    }
    async getCategories() {
        const categories = await prisma_client_1.default.faq.findMany({
            where: { isActive: true },
            select: { category: true },
            distinct: ["category"],
        });
        return categories.map((c) => c.category);
    }
}
exports.FaqRepository = FaqRepository;
