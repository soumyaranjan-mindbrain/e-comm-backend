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
const profileController = __importStar(require("../../../controllers/profile/ProfileController"));
const validate_request_1 = __importDefault(require("../../../middleware/validate-request"));
const authenticate_user_1 = __importDefault(require("../../../middleware/authenticate-user"));
const request_schemas_1 = require("../../../data/request-schemas");
const upload_middleware_1 = require("../../../middleware/upload-middleware");
const router = (0, express_1.Router)();
// All routes here require authentication
router.use(authenticate_user_1.default);
/**
 * @openapi
 * /v1/profile/me:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 */
router.get("/me", profileController.getProfile);
/**
 * @openapi
 * /v1/profile/me:
 *   patch:
 *     tags:
 *       - Profile
 *     summary: Update current user profile (Details + Optional Photo)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.patch("/me", upload_middleware_1.upload.single("profileImage"), (0, validate_request_1.default)(request_schemas_1.updateProfileSchema), profileController.updateProfile);
/**
 * @openapi
 * /v1/profile/upload-photo:
 *   post:
 *     tags:
 *       - Profile
 *     summary: Upload profile photo directly to Cloudinary
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Photo uploaded successfully
 */
router.post("/upload-photo", upload_middleware_1.upload.single("profileImage"), profileController.uploadPhoto);
exports.default = router;
