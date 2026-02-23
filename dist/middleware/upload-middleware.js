"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const AppError_1 = __importDefault(require("../errors/AppError"));
// Use memory storage to get access to file buffer
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    // Only accept images
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(AppError_1.default.validation("Only image files are allowed"), false);
    }
};
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: fileFilter,
});
