"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyController = void 0;
const AdminContentRepository_1 = require("../../data/repositories/content/AdminContentRepository");
const repo = new AdminContentRepository_1.AdminContentRepository();
class PolicyController {
    static async getTerms(req, res, next) {
        try {
            const content = await repo.getContentBySlug('terms');
            res.status(200).json({ success: true, data: content });
        }
        catch (error) {
            next(error);
        }
    }
    static async getPrivacy(req, res, next) {
        try {
            const content = await repo.getContentBySlug('privacy');
            res.status(200).json({ success: true, data: content });
        }
        catch (error) {
            next(error);
        }
    }
    static async getReturns(req, res, next) {
        try {
            const content = await repo.getContentBySlug('returns');
            res.status(200).json({ success: true, data: content });
        }
        catch (error) {
            next(error);
        }
    }
    static async getShipping(req, res, next) {
        try {
            const content = await repo.getContentBySlug('shipping');
            res.status(200).json({ success: true, data: content });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PolicyController = PolicyController;
