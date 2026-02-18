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
exports.getAllProductImageRegisters = exports.getProductImageRegistersByProductId = exports.getProductImageRegisterById = void 0;
const productImageRegisterRepository = __importStar(require("../../data/repositories/ProductImageRegisterRepository"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
// Get product image register by ID
const getProductImageRegisterById = async (id) => {
    const image = await productImageRegisterRepository.getProductImageRegisterById(id);
    if (!image) {
        throw AppError_1.default.notFound("Product image register not found.");
    }
    return image;
};
exports.getProductImageRegisterById = getProductImageRegisterById;
// Get product image registers by product ID
const getProductImageRegistersByProductId = async (productId) => {
    return productImageRegisterRepository.getProductImageRegistersByProductId(productId);
};
exports.getProductImageRegistersByProductId = getProductImageRegistersByProductId;
// Get all product image registers
const getAllProductImageRegisters = async (limit, cursor) => {
    const queryLimit = limit && limit > 0 ? Math.floor(limit) : 50;
    const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
    return productImageRegisterRepository.getAllProductImageRegisters(queryLimit, queryCursor);
};
exports.getAllProductImageRegisters = getAllProductImageRegisters;
//# sourceMappingURL=ProductImageRegisterUseCase.js.map