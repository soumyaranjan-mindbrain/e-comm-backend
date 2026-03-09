"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const NotificationRepository_1 = require("../../data/repositories/notification/NotificationRepository");
const repo = new NotificationRepository_1.NotificationRepository();
class NotificationController {
    /**
     * GET /v1/notifications
     */
    static async getNotifications(req, res) {
        try {
            const userId = req.user.comId || req.user.id;
            const skip = parseInt(req.query.skip) || 0;
            const take = parseInt(req.query.take) || 20;
            const notifications = await repo.getNotificationsByUser(userId, skip, take);
            const unreadCount = await repo.getUnreadCount(userId);
            res.status(200).json({
                success: true,
                data: notifications,
                meta: {
                    unreadCount
                }
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    /**
     * PATCH /v1/notifications/:id/read
     */
    static async markAsRead(req, res) {
        try {
            const userId = req.user.comId || req.user.id;
            const notificationId = parseInt(req.params.id);
            await repo.markAsRead(notificationId, userId);
            res.status(200).json({
                success: true,
                message: "Notification marked as read."
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    /**
     * PATCH /v1/notifications/read-all
     */
    static async markAllAsRead(req, res) {
        try {
            const userId = req.user.comId || req.user.id;
            await repo.markAllAsRead(userId);
            res.status(200).json({
                success: true,
                message: "All notifications marked as read."
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    /**
     * DELETE /v1/notifications/:id
     */
    static async deleteNotification(req, res) {
        try {
            const userId = req.user.comId || req.user.id;
            const notificationId = parseInt(req.params.id);
            await repo.deleteNotification(notificationId, userId);
            res.status(200).json({
                success: true,
                message: "Notification deleted successfully."
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.NotificationController = NotificationController;
