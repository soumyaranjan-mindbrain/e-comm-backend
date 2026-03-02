"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrderSchema = exports.createOrderSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createOrderSchema = joi_1.default.object({
    items: joi_1.default.array()
        .items(joi_1.default.object({
        productId: joi_1.default.number().integer().positive().required(),
        qnty: joi_1.default.number().integer().positive().required(),
        rate: joi_1.default.number().positive().required(),
        net_amount: joi_1.default.number().positive().required(),
    }))
        .min(1)
        .required(),
    total_amount: joi_1.default.number().positive().required(),
    discounted_amount: joi_1.default.number().min(0).optional(),
    del_charge_amount: joi_1.default.number().min(0).optional(),
    tax_amount_b_coins: joi_1.default.number().min(0).optional(),
    payment_mode: joi_1.default.string().required(),
    delivery_date: joi_1.default.date().iso().optional(),
    coinsToRedeem: joi_1.default.number().min(0).optional(), // Added for wallet logic
});
exports.cancelOrderSchema = joi_1.default.object({
    updated_by: joi_1.default.number().integer().positive().optional(),
    cancel_reason: joi_1.default.string().required(),
    cancelled_by_type: joi_1.default.string()
        .valid("user", "admin", "system", "USER", "ADMIN", "SYSTEM")
        .required(),
});
//# sourceMappingURL=validation.js.map