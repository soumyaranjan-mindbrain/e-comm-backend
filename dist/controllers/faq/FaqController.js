"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqController = void 0;
const FaqRepository_1 = require("../../data/repositories/faq/FaqRepository");
const repo = new FaqRepository_1.FaqRepository();
class FaqController {
    /**
     * GET /v1/faq
     */
    static async getFaqs(req, res, next) {
        try {
            const faqs = await repo.getAllFaqs();
            res.status(200).json({
                success: true,
                data: faqs,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /v1/faq/categories
     */
    static async getFaqCategories(req, res, next) {
        try {
            const categories = await repo.getCategories();
            res.status(200).json({
                success: true,
                data: categories,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.FaqController = FaqController;
