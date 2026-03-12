"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const RegisterDeviceUseCase_1 = require("../../usecases/notification/RegisterDeviceUseCase");
const SendNotificationUseCase_1 = require("../../usecases/notification/SendNotificationUseCase");
class NotificationController {
    static async registerDevice(req, res) {
        try {
            const userId = req.user.id;
            const { token, platform } = req.body;
            const result = await RegisterDeviceUseCase_1.registerDeviceUsecase.execute(userId, token, platform);
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            console.error("Error in registerDevice:", error);
            res.status(500).json({
                success: false,
                message: "Failed to register device token",
            });
        }
    }
    static async sendNotification(req, res) {
        try {
            const { title, message } = req.body;
            const result = await SendNotificationUseCase_1.sendNotificationUsecase.execute(title, message);
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            console.error("Error in sendNotification:", error);
            res.status(500).json({
                success: false,
                message: "Failed to send notification",
            });
        }
    }
}
exports.NotificationController = NotificationController;
