"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("./CustomError"));
class AppError {
    // --- 4xx Client Errors ---
    static badRequest(message) {
        return new CustomError_1.default({ message, statusCode: 400, code: "ERR_VALID" });
    }
    static unauthorized(message) {
        return new CustomError_1.default({ message, statusCode: 401, code: "ERR_AUTH" });
    }
    static paymentRequired(message) {
        return new CustomError_1.default({ message, statusCode: 402, code: "ERR_VALID" });
    }
    static forbidden(message) {
        return new CustomError_1.default({ message, statusCode: 403, code: "ERR_FORBIDDEN" });
    }
    static notFound(message) {
        return new CustomError_1.default({ message, statusCode: 404, code: "ERR_NF" });
    }
    static methodNotAllowed(message) {
        return new CustomError_1.default({ message, statusCode: 405, code: "ERR_VALID" });
    }
    static notAcceptable(message) {
        return new CustomError_1.default({ message, statusCode: 406, code: "ERR_VALID" });
    }
    static proxyAuthRequired(message) {
        return new CustomError_1.default({ message, statusCode: 407, code: "ERR_AUTH" });
    }
    static requestTimeout(message) {
        return new CustomError_1.default({ message, statusCode: 408, code: "ERR_TIMEOUT" });
    }
    static conflict(message) {
        return new CustomError_1.default({ message, statusCode: 409, code: "ERR_CONFLICT" });
    }
    static gone(message) {
        return new CustomError_1.default({ message, statusCode: 410, code: "ERR_NF" });
    }
    static lengthRequired(message) {
        return new CustomError_1.default({ message, statusCode: 411, code: "ERR_VALID" });
    }
    static preconditionFailed(message) {
        return new CustomError_1.default({ message, statusCode: 412, code: "ERR_VALID" });
    }
    static payloadTooLarge(message) {
        return new CustomError_1.default({ message, statusCode: 413, code: "ERR_LIMIT" });
    }
    static uriTooLong(message) {
        return new CustomError_1.default({ message, statusCode: 414, code: "ERR_VALID" });
    }
    static unsupportedMediaType(message) {
        return new CustomError_1.default({
            message,
            statusCode: 415,
            code: "ERR_UNSUPPORTED",
        });
    }
    static rangeNotSatisfiable(message) {
        return new CustomError_1.default({ message, statusCode: 416, code: "ERR_VALID" });
    }
    static expectationFailed(message) {
        return new CustomError_1.default({ message, statusCode: 417, code: "ERR_VALID" });
    }
    static imATeapot(message) {
        return new CustomError_1.default({ message, statusCode: 418, code: "ERR_VALID" });
    }
    static misdirectedRequest(message) {
        return new CustomError_1.default({ message, statusCode: 421, code: "ERR_VALID" });
    }
    static validation(message) {
        return new CustomError_1.default({ message, statusCode: 422, code: "ERR_VALID" });
    }
    static locked(message) {
        return new CustomError_1.default({ message, statusCode: 423, code: "ERR_FORBIDDEN" });
    }
    static failedDependency(message) {
        return new CustomError_1.default({ message, statusCode: 424, code: "ERR_VALID" });
    }
    static tooEarly(message) {
        return new CustomError_1.default({ message, statusCode: 425, code: "ERR_VALID" });
    }
    static upgradeRequired(message) {
        return new CustomError_1.default({ message, statusCode: 426, code: "ERR_VALID" });
    }
    static preconditionRequired(message) {
        return new CustomError_1.default({ message, statusCode: 428, code: "ERR_VALID" });
    }
    static tooManyRequests(message) {
        return new CustomError_1.default({ message, statusCode: 429, code: "ERR_LIMIT" });
    }
    static headerFieldsTooLarge(message) {
        return new CustomError_1.default({ message, statusCode: 431, code: "ERR_LIMIT" });
    }
    static legalReasons(message) {
        return new CustomError_1.default({ message, statusCode: 451, code: "ERR_FORBIDDEN" });
    }
    // --- 5xx Server Errors ---
    static internal(message) {
        return new CustomError_1.default({ message, statusCode: 500, code: "ERR_SERVER" });
    }
    static notImplemented(message) {
        return new CustomError_1.default({ message, statusCode: 501, code: "ERR_SERVER" });
    }
    static badGateway(message) {
        return new CustomError_1.default({ message, statusCode: 502, code: "ERR_SERVICE" });
    }
    static serviceUnavailable(message) {
        return new CustomError_1.default({ message, statusCode: 503, code: "ERR_SERVICE" });
    }
    static gatewayTimeout(message) {
        return new CustomError_1.default({ message, statusCode: 504, code: "ERR_SERVICE" });
    }
    static httpVersionNotSupported(message) {
        return new CustomError_1.default({ message, statusCode: 505, code: "ERR_SERVER" });
    }
    static variantAlsoNegotiates(message) {
        return new CustomError_1.default({ message, statusCode: 506, code: "ERR_SERVER" });
    }
    static insufficientStorage(message) {
        return new CustomError_1.default({ message, statusCode: 507, code: "ERR_SERVER" });
    }
    static loopDetected(message) {
        return new CustomError_1.default({ message, statusCode: 508, code: "ERR_SERVER" });
    }
    static notExtended(message) {
        return new CustomError_1.default({ message, statusCode: 510, code: "ERR_SERVER" });
    }
    static networkAuthRequired(message) {
        return new CustomError_1.default({ message, statusCode: 511, code: "ERR_AUTH" });
    }
}
exports.default = AppError;
