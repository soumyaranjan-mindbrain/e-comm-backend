"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController = __importStar(require("../../../controllers/auth/AuthController"));
const validate_request_1 = __importDefault(require("../../../middleware/validate-request"));
const authenticate_user_1 = __importDefault(require("../../../middleware/authenticate-user"));
const request_schemas_1 = require("../../../data/request-schemas");
const router = (0, express_1.Router)();
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
router.post("/send-otp", (0, validate_request_1.default)(request_schemas_1.sendOtpSchema), authController.sendOtp);
/**
 * @openapi
 * /v1/auth/resend-otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Resend OTP to mobile number
 */
router.post("/resend-otp", (0, validate_request_1.default)(request_schemas_1.sendOtpSchema), authController.resendOtp);
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
router.post("/verify-otp", (0, validate_request_1.default)(request_schemas_1.verifyOtpSchema), authController.verifyOtp);
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
router.post("/signup", (0, validate_request_1.default)(request_schemas_1.signupSchema), authController.signup);
/**
 * @openapi
 * /v1/auth/refresh-token:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh access token
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed
 */
router.post("/refresh-token", authController.refreshToken);
/**
 * @openapi
 * /v1/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout user and clear session
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout", authenticate_user_1.default, authController.logout);
exports.default = router;
