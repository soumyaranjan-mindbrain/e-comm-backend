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
exports.search = exports.remove = exports.update = exports.create = exports.getOne = exports.getAll = void 0;
const usecase = __importStar(require("../../usecases/coupon-codes/CouponCodeUseCase"));
const getAll = async (req, res, next) => {
    try {
        const data = await usecase.getAllCouponCodes();
        res.json({
            success: true,
            count: data.length,
            data,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.getAll = getAll;
const getOne = async (req, res, next) => {
    try {
        const coupon = await usecase.getCouponCodeById(Number(req.params.id));
        res.json({ success: true, data: coupon });
    }
    catch (e) {
        next(e);
    }
};
exports.getOne = getOne;
const create = async (req, res, next) => {
    try {
        const coupon = await usecase.createCouponCode(req.body);
        res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            data: coupon,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.create = create;
const update = async (req, res, next) => {
    try {
        const coupon = await usecase.updateCouponCode(Number(req.params.id), req.body);
        res.json({
            success: true,
            message: "Coupon updated successfully",
            data: coupon,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.update = update;
const remove = async (req, res, next) => {
    try {
        await usecase.deleteCouponCode(Number(req.params.id));
        res.json({
            success: true,
            message: "Coupon deleted successfully",
        });
    }
    catch (e) {
        next(e);
    }
};
exports.remove = remove;
const search = async (req, res, next) => {
    try {
        const q = req.query.q;
        if (!q || q.trim() === "") {
            res.status(400).json({
                success: false,
                message: "Search term is required. Please provide 'q' query parameter.",
            });
            return;
        }
        const data = await usecase.searchCouponCodesByName(q.trim());
        res.json({
            success: true,
            count: data.length,
            searchTerm: q.trim(),
            data,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.search = search;
//# sourceMappingURL=CouponCodeController.js.map