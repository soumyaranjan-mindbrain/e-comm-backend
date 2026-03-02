import { Request, Response } from "express";
import { AdminContentRepository } from "../../data/repositories/content/AdminContentRepository";

const repo = new AdminContentRepository();

export class PolicyController {
    static async getTerms(req: Request, res: Response): Promise<void> {
        try {
            const content = await repo.getContentBySlug('terms-and-conditions');
            res.status(200).json({ success: true, data: content });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getReturns(req: Request, res: Response): Promise<void> {
        try {
            const content = await repo.getContentBySlug('return-refunds');
            res.status(200).json({ success: true, data: content });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getShipping(req: Request, res: Response): Promise<void> {
        try {
            const content = await repo.getContentBySlug('shipping-policy');
            res.status(200).json({ success: true, data: content });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
