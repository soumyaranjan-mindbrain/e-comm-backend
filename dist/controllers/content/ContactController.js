"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const AdminContentRepository_1 = require("../../data/repositories/content/AdminContentRepository");
const repo = new AdminContentRepository_1.AdminContentRepository();
class ContactController {
    /**
     * GET /v1/contact/info
     */
    static async getInfo(req, res) {
        try {
            const content = await repo.getContentBySlug('contact-info');
            let data = {};
            if (content?.content) {
                try {
                    data = JSON.parse(content.content);
                }
                catch (e) {
                    data = { raw: content.content };
                }
            }
            res.status(200).json({
                success: true,
                data: data,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    /**
     * POST /v1/contact/enquiry
     */
    static async submitEnquiry(req, res) {
        try {
            const { fullName, email, phone, subject, message } = req.body;
            if (!fullName || !email || !message) {
                res.status(400).json({ success: false, message: "Full name, email, and message are required." });
                return;
            }
            await repo.saveEnquiry({ fullName, email, phone, subject, message });
            res.status(201).json({
                success: true,
                message: "Enquiry submitted successfully. We will get back to you soon.",
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.ContactController = ContactController;
