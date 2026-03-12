"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NotificationController_1 = require("../../../controllers/notification/NotificationController");
const authenticate_user_1 = __importDefault(require("../../../middleware/authenticate-user"));
const router = (0, express_1.Router)();
// Protect all notification routes
router.use(authenticate_user_1.default);
// Register device token
router.post("/register-device", NotificationController_1.NotificationController.registerDevice);
// Send notification (admin)
router.post("/send", NotificationController_1.NotificationController.sendNotification);
exports.default = router;
