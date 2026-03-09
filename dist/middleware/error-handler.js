"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
const utils_1 = require("../utils");
const CustomError_1 = __importDefault(require("../errors/CustomError"));
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const joi_1 = __importDefault(require("joi"));
function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        next(error);
        return;
    }
    // Handle Joi validation errors
    if (joi_1.default.isError(error)) {
        const fieldErrors = {};
        error.details.forEach((detail) => {
            const key = detail.path.join(".");
            fieldErrors[key] = detail.message.replace(/['"]/g, "");
        });
        res.status(422).json({
            success: false,
            code: "ERR_VALIDATION",
            message: fieldErrors,
        });
        return;
    }
    // Handle Custom errors (AppError)
    if (error instanceof CustomError_1.default) {
        res.status(error.statusCode).json({
            success: false,
            code: error.code,
            message: error.message.toLowerCase(),
        });
        return;
    }
    // Handle JWT Unauthorized errors
    if (error instanceof express_oauth2_jwt_bearer_1.UnauthorizedError) {
        res.status(error.statusCode).json({
            success: false,
            code: "code" in error ? error.code : "ERR_AUTH",
            message: error.message.toLowerCase(),
        });
        return;
    }
    // Handle generic errors
    console.error("[ErrorHandler] Unhandled Error:", error);
    res.status(500).json({
        success: false,
        code: "ERR_SERVER",
        message: ((0, utils_1.getErrorMessage)(error) || "internal server error").toLowerCase(),
    });
}
