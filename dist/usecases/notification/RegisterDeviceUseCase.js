"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDeviceUsecase = void 0;
const DeviceTokenRepository_1 = require("../../data/repositories/notification/DeviceTokenRepository");
class RegisterDeviceUsecase {
    async execute(userId, token, platform) {
        return DeviceTokenRepository_1.deviceTokenRepository.saveToken(userId, token, platform);
    }
}
exports.registerDeviceUsecase = new RegisterDeviceUsecase();
