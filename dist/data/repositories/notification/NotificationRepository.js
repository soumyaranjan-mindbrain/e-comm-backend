"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const prisma_client_1 = __importDefault(require("../../../prisma-client"));
class NotificationRepository {
    async getNotificationsByUser(userId, skip = 0, take = 20) {
        return prisma_client_1.default.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            skip,
            take,
        });
    }
    async getUnreadCount(userId) {
        return prisma_client_1.default.notification.count({
            where: { userId, isRead: false },
        });
    }
    async markAsRead(id, userId) {
        return prisma_client_1.default.notification.updateMany({
            where: { id, userId },
            data: { isRead: true },
        });
    }
    async markAllAsRead(userId) {
        return prisma_client_1.default.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
    async deleteNotification(id, userId) {
        return prisma_client_1.default.notification.deleteMany({
            where: { id, userId },
        });
    }
}
exports.NotificationRepository = NotificationRepository;
