"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validateRequest;
const AppError_1 = __importDefault(require("../errors/AppError"));
function validateRequest(schema, source = "body") {
    return async function validator(req, res, next) {
        try {
            const data = source === "body" ? req.body : req.query;
            if (source === "body" && (!data || Object.keys(data).length === 0)) {
                if (req.method === "POST" ||
                    req.method === "PUT" ||
                    req.method === "PATCH") {
                    return next(AppError_1.default.badRequest("Request body is missing or empty."));
                }
            }
            const validated = await schema.validateAsync(data || {}, {
                abortEarly: false,
            });
            if (source === "body") {
                req.body = validated;
            }
            else {
                // req.query is read-only, so we store validated data in res.locals
                res.locals.validatedQuery = validated;
                // Optionally update req.query if possible without throwing
                try {
                    Object.keys(req.query).forEach((key) => delete req.query[key]);
                    Object.assign(req.query, validated);
                }
                catch (err) {
                    // Ignore if req.query is immutable
                }
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=validate-request.js.map