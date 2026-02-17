import { Router } from "express";
import * as authController from "../../../controllers/AuthController";
import validateRequest from "../../../middleware/validate-request";
import { sendOtpSchema, verifyOtpSchema, signupSchema } from "../../../data/request-schemas";

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

/**
 * @openapi
 * /v1/auth/signup:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Signup a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - mobile
 *               - email
 *             properties:
 *               fullName:
 *                 type: string
 *               mobile:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Signup successful
 */
router.post("/signup", validateRequest(signupSchema), authController.signup);

export default router;
