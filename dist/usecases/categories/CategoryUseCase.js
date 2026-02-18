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
exports.getCategoryById = exports.getAllCategories = void 0;
const categoryRepository = __importStar(require("../../data/repositories/CategoryRepository"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const utils_1 = require("../../utils");
const getAllCategories = async (limit, cursor, search) => {
    const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
    const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
    const searchTerm = search?.trim().toLowerCase();
    if (!searchTerm) {
        return await categoryRepository.getAllCategories(queryLimit, queryCursor);
    }
    const allCategories = await categoryRepository.getAllCategories(100, 0);
    const categories = allCategories.data;
    const scoredCategories = categories
        .map((cat) => {
        const name = (cat.catName || "").toLowerCase();
        let score = 0;
        if (name === searchTerm)
            score = 100;
        else if (name.startsWith(searchTerm))
            score = 80;
        else if (name.includes(searchTerm))
            score = 50;
        else {
            const distance = (0, utils_1.getLevenshteinDistance)(name, searchTerm);
            if (distance <= 2) {
                score = 40 - distance * 10;
            }
        }
        return { ...cat, score };
    })
        .filter((cat) => cat.score > 0)
        .sort((a, b) => b.score - a.score || (a.disorder || 0) - (b.disorder || 0));
    return {
        data: scoredCategories.slice(0, queryLimit),
        nextCursor: null,
        totalCount: scoredCategories.length,
    };
};
exports.getAllCategories = getAllCategories;
const getCategoryById = async (id) => {
    const category = await categoryRepository.getCategoryById(id);
    if (!category) {
        throw AppError_1.default.notFound("Category not found.");
    }
    return category;
};
exports.getCategoryById = getCategoryById;
