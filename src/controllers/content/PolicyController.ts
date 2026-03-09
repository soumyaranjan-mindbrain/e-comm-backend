import { Request, Response, NextFunction } from "express";
import { AdminContentRepository } from "../../data/repositories/content/AdminContentRepository";

const repo = new AdminContentRepository();

export class PolicyController {
    static async getTerms(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const content = await repo.getContentBySlug('terms');
            res.status(200).json({ success: true, data: content });
        } catch (error) {
            next(error);
        }
    }

    static async getPrivacy(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const content = await repo.getContentBySlug('privacy');
            res.status(200).json({ success: true, data: content });
        } catch (error) {
            next(error);
        }
    }

    static async getReturns(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const content = await repo.getContentBySlug('returns');
            res.status(200).json({ success: true, data: content });
        } catch (error) {
            next(error);
        }
    }

    static async getShipping(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const content = await repo.getContentBySlug('shipping');
            res.status(200).json({ success: true, data: content });
        } catch (error) {
            next(error);
        }
    }
}
