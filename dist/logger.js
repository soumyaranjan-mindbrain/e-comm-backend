"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const config_1 = __importDefault(require("./config"));
const logLevels = {
    error: 0, // highest priority
    warning: 1,
    info: 2,
    http: 3,
    debug: 4,
};
const logger = winston_1.default.createLogger({
    levels: logLevels,
    level: config_1.default.logLevel,
    format: winston_1.default.format.combine(winston_1.default.format.errors({ stack: true }), winston_1.default.format.timestamp({
        format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }), winston_1.default.format.printf(({ timestamp, level, message, logMetadata, stack }) => {
        return `${timestamp} ${level}: ${logMetadata || ""} ${message} ${stack || ""}`;
    })),
    transports: [new winston_1.default.transports.Console()],
});
// const fileRotateTransport = new DailyRotateFile({
//   filename: "logs/application-%DATE%.log",
//   datePattern: "YYYY-MM-DD",
//   zippedArchive: true,
//   maxSize: "20m",
//   maxFiles: "14d",
//   format: winston.format.combine(
//     winston.format.errors({ stack: true }),
//     winston.format.timestamp(),
//     winston.format.json(),
//   ),
// });
// logger.add(fileRotateTransport);
exports.default = logger;
