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
router.get("/", NotificationController_1.NotificationController.getNotifications);
router.patch("/read-all", NotificationController_1.NotificationController.markAllAsRead); // Must be before /:id so it doesn't match :id
router.patch("/:id/read", NotificationController_1.NotificationController.markAsRead);
router.delete("/:id", NotificationController_1.NotificationController.deleteNotification);
exports.default = router;
