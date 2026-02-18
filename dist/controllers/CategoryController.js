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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOne = exports.getAll = void 0;
const categoryUseCase = __importStar(require("../usecases/categories/CategoryUseCase"));
const getAll = async (req, res, next) => {
    try {
        const limit = req.query.limit
            ? parseInt(req.query.limit)
            : undefined;
        const cursor = req.query.cursor
            ? parseInt(req.query.cursor)
            : undefined;
        const search = req.query.q;
        const result = await categoryUseCase.getAllCategories(limit, cursor, search);
        res.status(200).json({
            success: true,
            data: result.data,
            nextCursor: result.nextCursor,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const getOne = async (req, res, next) => {
    try {
        const category = await categoryUseCase.getCategoryById(parseInt(req.params.id));
        res.status(200).json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getOne = getOne;
//# sourceMappingURL=CategoryController.js.map