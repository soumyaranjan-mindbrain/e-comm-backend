"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
const config_1 = __importDefault(require("../config"));
const utils_1 = require("../utils");
const CustomError_1 = __importDefault(require("../errors/CustomError"));
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const joi_1 = __importDefault(require("joi"));
function errorHandler(error, req, res, next) {
    if (res.headersSent || config_1.default.debug) {
        next(error);
        return;
    }
    if (joi_1.default.isError(error)) {
        const validationError = {
            error: {
                message: "Validation error",
                code: "ERR_VALID",
                errors: error.details.map((item) => ({
                    message: item.message,
                })),
            },
        };
        res.status(422).json(validationError);
        return;
    }
    if (error instanceof CustomError_1.default) {
        res.status(error.statusCode).json({
            error: {
                message: error.message,
                code: error.code,
            },
        });
        return;
    }
    if (error instanceof express_oauth2_jwt_bearer_1.UnauthorizedError) {
        res.status(error.statusCode).json({
            error: {
                message: error.message,
                code: "code" in error ? error.code : "ERR_AUTH",
            },
        });
        return;
    }
    res.status(500).json({
        error: {
            message: (0, utils_1.getErrorMessage)(error) ||
                "An error occurred. Please view logs for more details",
        },
    });
}
//# sourceMappingURL=error-handler.js.map