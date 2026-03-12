"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationUsecase = void 0;
const DeviceTokenRepository_1 = require("../../data/repositories/notification/DeviceTokenRepository");
const PushService_1 = require("../../services/PushService");
class SendNotificationUsecase {
    async execute(title, message) {
        const tokens = await DeviceTokenRepository_1.deviceTokenRepository.getAllTokens();
        return PushService_1.pushService.sendPush(tokens, title, message);
    }
}
exports.sendNotificationUsecase = new SendNotificationUsecase();
