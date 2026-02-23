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
exports.createServer = void 0;
// Force restart - Merge Auth
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swaggerUi = __importStar(require("swagger-ui-express"));
const config_1 = __importDefault(require("./config"));
const v1_1 = __importDefault(require("./api/v1"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const morgan_middleware_1 = __importDefault(require("./middleware/morgan-middleware"));
const swagger_1 = __importDefault(require("./config/swagger"));
const createServer = () => {
    const app = (0, express_1.default)();
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 1000, // Limit each IP to 1000 requests per `window`
        standardHeaders: true,
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });
    app
        .use((0, helmet_1.default)())
        .use(limiter)
        .disable("x-powered-by")
        .use(morgan_middleware_1.default)
        .use((0, cookie_parser_1.default)())
        .use(express_1.default.urlencoded({ extended: true }))
        .use(express_1.default.json())
        .use((0, cors_1.default)({
        origin: (origin, callback) => {
            // Allow all origins but echo back the origin for credentials support
            callback(null, true);
        },
        credentials: true,
    }));
    /**
     * @openapi
     * /health:
     *   get:
     *     tags:
     *       - Health
     *     description: Health check endpoint
     *     responses:
     *       200:
     *         description: Returns status ok
     */
    app.get("/health", (req, res) => {
        res.json({ ok: true, environment: config_1.default.env });
    });
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger_1.default));
    app.use("/v1", v1_1.default);
    app.use(error_handler_1.default);
    return app;
};
exports.createServer = createServer;
