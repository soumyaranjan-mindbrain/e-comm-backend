import { Router } from "express";
import * as authController from "../../../controllers/AuthController";
import validateRequest from "../../../middleware/validate-request";
import { sendOtpSchema, verifyOtpSchema } from "../../../data/request-schemas";

const router = Router();

/**
 * @openapi
 * /v1/auth/send-otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Send OTP to mobile number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile
 *             properties:
 *               mobile:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post("/send-otp", validateRequest(sendOtpSchema), authController.sendOtp);

/**
 * @openapi
 * /v1/auth/verify-otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify OTP and login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile
 *               - otp
 *             properties:
 *               mobile:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post(
    "/verify-otp",
    validateRequest(verifyOtpSchema),
    authController.verifyOtp,
);

export default router;
