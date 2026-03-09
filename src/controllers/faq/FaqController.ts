import { Request, Response, NextFunction } from "express";
import { FaqRepository } from "../../data/repositories/faq/FaqRepository";

const repo = new FaqRepository();

export class FaqController {
    /**
     * GET /v1/faq
     */
    static async getFaqs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const faqs = await repo.getAllFaqs();
            res.status(200).json({
                success: true,
                data: faqs,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /v1/faq/categories
     */
    static async getFaqCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const categories = await repo.getCategories();
            res.status(200).json({
                success: true,
                data: categories,
            });
        } catch (error) {
            next(error);
        }
    }
}
