import { Response, NextFunction } from "express";
import { NotificationRepository } from "../../data/repositories/notification/NotificationRepository";
import { AuthRequest } from "../../middleware/authenticate-user";

const repo = new NotificationRepository();

export class NotificationController {
    /**
     * GET /v1/notifications
     */
    static async getNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.comId || req.user!.id;
            const skip = parseInt(req.query.skip as string) || 0;
            const take = parseInt(req.query.take as string) || 20;

            const notifications = await repo.getNotificationsByUser(userId, skip, take);
            const unreadCount = await repo.getUnreadCount(userId);

            res.status(200).json({
                success: true,
                data: notifications,
                meta: {
                    unreadCount
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /v1/notifications/:id/read
     */
    static async markAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.comId || req.user!.id;
            const notificationId = parseInt(req.params.id);

            await repo.markAsRead(notificationId, userId);

            res.status(200).json({
                success: true,
                message: "Notification marked as read."
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /v1/notifications/read-all
     */
    static async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.comId || req.user!.id;

            await repo.markAllAsRead(userId);

            res.status(200).json({
                success: true,
                message: "All notifications marked as read."
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /v1/notifications/:id
     */
    static async deleteNotification(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.comId || req.user!.id;
            const notificationId = parseInt(req.params.id);

            await repo.deleteNotification(notificationId, userId);

            res.status(200).json({
                success: true,
                message: "Notification deleted successfully."
            });
        } catch (error) {
            next(error);
        }
    }
}
