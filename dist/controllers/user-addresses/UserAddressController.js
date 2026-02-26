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
exports.remove = exports.update = exports.create = exports.getOne = exports.getMine = void 0;
const userAddressUseCase = __importStar(require("../../usecases/user-addresses/UserAddressUseCase"));
const getMine = async (req, res, next) => {
    try {
        const customerId = req.user?.id;
        const limit = req.query.limit
            ? parseInt(req.query.limit)
            : undefined;
        const cursor = req.query.cursor
            ? parseInt(req.query.cursor)
            : undefined;
        if (!customerId) {
            res
                .status(401)
                .json({ success: false, code: "ERR_AUTH", message: "unauthorized" });
            return;
        }
        const result = await userAddressUseCase.getUserAddressesByCustomerId(customerId, limit, cursor);
        res.status(200).json({
            success: true,
            message: "addresses fetched successfully",
            data: result.data,
            nextCursor: result.nextCursor,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMine = getMine;
const getOne = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const customerId = req.user?.id;
        if (isNaN(id) || !customerId) {
            res.status(400).json({
                success: false,
                code: "ERR_BAD_REQUEST",
                message: "invalid request",
            });
            return;
        }
        const address = await userAddressUseCase.getUserAddressById(id);
        if (address.userId !== customerId) {
            res
                .status(403)
                .json({ success: false, code: "ERR_FORBIDDEN", message: "forbidden" });
            return;
        }
        res.status(200).json({
            success: true,
            message: "address fetched successfully",
            data: address,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getOne = getOne;
const create = async (req, res, next) => {
    try {
        const customerId = req.user?.id;
        if (!customerId) {
            res
                .status(401)
                .json({ success: false, code: "ERR_AUTH", message: "unauthorized" });
            return;
        }
        const userAddress = await userAddressUseCase.createUserAddress({
            ...req.body,
            customerId,
            createdBy: customerId,
        });
        res.status(201).json({
            success: true,
            message: "address created successfully",
            data: userAddress,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const update = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const customerId = req.user?.id;
        if (isNaN(id) || !customerId) {
            res.status(400).json({
                success: false,
                code: "ERR_BAD_REQUEST",
                message: "invalid request",
            });
            return;
        }
        const userAddress = await userAddressUseCase.updateUserAddress(id, {
            ...req.body,
            customerId,
            updatedBy: customerId,
        });
        res.status(200).json({
            success: true,
            message: "address updated successfully",
            data: userAddress,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.update = update;
const remove = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const customerId = req.user?.id;
        if (isNaN(id) || !customerId) {
            res.status(400).json({
                success: false,
                code: "ERR_BAD_REQUEST",
                message: "invalid request",
            });
            return;
        }
        await userAddressUseCase.deleteUserAddress(id, customerId);
        res.status(200).json({
            success: true,
            message: "address deleted successfully",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.remove = remove;
//# sourceMappingURL=UserAddressController.js.map