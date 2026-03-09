"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyController = void 0;
const AdminContentRepository_1 = require("../../data/repositories/content/AdminContentRepository");
const repo = new AdminContentRepository_1.AdminContentRepository();
class PolicyController {
    static async getTerms(req, res) {
        try {
            const content = await repo.getContentBySlug('terms');
            res.status(200).json({ success: true, data: content });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getPrivacy(req, res) {
        try {
            const content = await repo.getContentBySlug('privacy');
            res.status(200).json({ success: true, data: content });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getReturns(req, res) {
        try {
            const content = await repo.getContentBySlug('returns');
            res.status(200).json({ success: true, data: content });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getShipping(req, res) {
        try {
            const content = await repo.getContentBySlug('shipping');
            res.status(200).json({ success: true, data: content });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.PolicyController = PolicyController;
