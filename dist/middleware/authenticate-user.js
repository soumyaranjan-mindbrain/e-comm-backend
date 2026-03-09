"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const tokenBlocklist_1 = require("../utils/tokenBlocklist");
const authenticateUser = async (req, res, next) => {
    // Try to get token from cookies first, then fallback to Authorization header
    let token = req.cookies?.accessToken;
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
    }
    if (!token) {
        return next(AppError_1.default.unauthorized("authentication token is missing or invalid"));
    }
    // Check if this token was explicitly revoked (post-logout)
    try {
        if (await (0, tokenBlocklist_1.isTokenBlocked)(token)) {
            return next(AppError_1.default.unauthorized("session has been logged out"));
        }
    }
    catch (error) {
        return next(AppError_1.default.unauthorized("session expired or invalid token"));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        next(AppError_1.default.unauthorized("session expired or invalid token"));
    }
};
exports.default = authenticateUser;
