"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendUserNotificationUsecase = void 0;
const DeviceTokenRepository_1 = require("../../data/repositories/notification/DeviceTokenRepository");
const PushService_1 = require("../../services/PushService");
const NotificationRepository_1 = require("../../data/repositories/notification/NotificationRepository");
class SendUserNotificationUsecase {
    async execute(userId, title, message, type) {
        const tokens = await DeviceTokenRepository_1.deviceTokenRepository.getTokensByUser(userId);
        await PushService_1.pushService.sendPush(tokens, title, message);
        return NotificationRepository_1.notificationRepository.createNotification(userId, title, message, type);
    }
}
exports.sendUserNotificationUsecase = new SendUserNotificationUsecase();
