import { Router } from "express";
import { NotificationController } from "../../../controllers/notification/NotificationController";
import authenticateUser from "../../../middleware/authenticate-user";

const router = Router();

// Protect all notification routes
router.use(authenticateUser);

router.get("/", NotificationController.getNotifications);
router.patch("/read-all", NotificationController.markAllAsRead); // Must be before /:id so it doesn't match :id
router.patch("/:id/read", NotificationController.markAsRead);
router.delete("/:id", NotificationController.deleteNotification);

export default router;
