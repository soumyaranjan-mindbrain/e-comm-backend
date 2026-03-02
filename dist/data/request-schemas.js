"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productFilterSchema = exports.updateProductRatingSchema = exports.createProductRatingSchema = exports.updateUserAddressSchema = exports.createUserAddressSchema = exports.updateCouponCodeSchema = exports.createCouponCodeSchema = exports.updateProfileSchema = exports.signupSchema = exports.verifyOtpSchema = exports.sendOtpSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// --- Auth Schemas ---
exports.sendOtpSchema = joi_1.default.object({
    mobile: joi_1.default.string().required().label("Mobile Number"),
})
    .unknown()
    .required();
exports.verifyOtpSchema = joi_1.default.object({
    mobile: joi_1.default.string().required().label("Mobile Number"),
    otp: joi_1.default.string().required().label("OTP"),
})
    .unknown()
    .required();
exports.signupSchema = joi_1.default.object({
    fullName: joi_1.default.string().min(3).required().label("Full Name"),
    mobile: joi_1.default.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .label("Mobile Number"),
    email: joi_1.default.string().email().required().label("Email"),
})
    .unknown()
    .required();
exports.updateProfileSchema = joi_1.default.object({
    fullName: joi_1.default.string().min(3).optional().label("Full Name"),
    email: joi_1.default.string().email().optional().label("Email"),
    profileImage: joi_1.default.string().optional().allow("", null).label("Profile Image"),
})
    .unknown()
    .required();
// --- Coupon Code Schemas ---
exports.createCouponCodeSchema = joi_1.default.object({
    name: joi_1.default.string().max(100).optional().allow("", null),
    description: joi_1.default.string().optional().allow("", null),
    termsConditions: joi_1.default.string().optional().allow("", null),
    validCategory: joi_1.default.string().max(100).optional().allow("", null),
    validBrand: joi_1.default.string().max(100).optional().allow("", null),
    validEdition: joi_1.default.string().max(100).optional().allow("", null),
    validItem: joi_1.default.string().max(100).optional().allow("", null),
    validPrice: joi_1.default.number().min(0).precision(2).optional().allow(null),
    validDate: joi_1.default.date().iso().optional().allow(null),
    issuedQnty: joi_1.default.number().integer().min(0).optional().allow(null),
    receivedQnty: joi_1.default.number().integer().min(0).optional().allow(null),
    userQnty: joi_1.default.number().integer().min(0).optional().allow(null),
    createdBy: joi_1.default.number().integer().optional(),
});
exports.updateCouponCodeSchema = joi_1.default.object({
    name: joi_1.default.string().max(100).optional().allow("", null),
    description: joi_1.default.string().optional().allow("", null),
    termsConditions: joi_1.default.string().optional().allow("", null),
    validCategory: joi_1.default.string().max(100).optional().allow("", null),
    validBrand: joi_1.default.string().max(100).optional().allow("", null),
    validEdition: joi_1.default.string().max(100).optional().allow("", null),
    validItem: joi_1.default.string().max(100).optional().allow("", null),
    validPrice: joi_1.default.number().min(0).precision(2).optional().allow(null),
    validDate: joi_1.default.date().iso().optional().allow(null),
    issuedQnty: joi_1.default.number().integer().min(0).optional().allow(null),
    receivedQnty: joi_1.default.number().integer().min(0).optional().allow(null),
    userQnty: joi_1.default.number().integer().min(0).optional().allow(null),
    updatedBy: joi_1.default.number().integer().optional(),
});
// --- User Address Schemas ---
exports.createUserAddressSchema = joi_1.default.object({
    userId: joi_1.default.number().integer().optional(),
    address: joi_1.default.string().optional().allow("", null),
    townCity: joi_1.default.string().max(100).optional().allow("", null),
    pincode: joi_1.default.string()
        .pattern(/^\d{6}$/)
        .optional()
        .allow("", null)
        .messages({
        "string.pattern.base": "Pincode must be a valid 6-digit number.",
    }),
    receiversName: joi_1.default.string().max(150).optional().allow("", null),
    receiversNumber: joi_1.default.string()
        .pattern(/^\d{10}$/)
        .optional()
        .allow("", null)
        .messages({
        "string.pattern.base": "Receiver's number must be a valid 10-digit mobile number.",
    }),
    saveAs: joi_1.default.string()
        .valid("Home", "Work", "Other")
        .optional()
        .allow("", null),
    state: joi_1.default.string().max(100).optional().allow("", null),
    isDefault: joi_1.default.boolean().optional(),
    createdBy: joi_1.default.number().integer().optional(),
});
exports.updateUserAddressSchema = joi_1.default.object({
    userId: joi_1.default.number().integer().optional(),
    address: joi_1.default.string().optional().allow("", null),
    townCity: joi_1.default.string().max(100).optional().allow("", null),
    pincode: joi_1.default.string()
        .pattern(/^\d{6}$/)
        .optional()
        .allow("", null)
        .messages({
        "string.pattern.base": "Pincode must be a valid 6-digit number.",
    }),
    receiversName: joi_1.default.string().max(150).optional().allow("", null),
    receiversNumber: joi_1.default.string()
        .pattern(/^\d{10}$/)
        .optional()
        .allow("", null)
        .messages({
        "string.pattern.base": "Receiver's number must be a valid 10-digit mobile number.",
    }),
    saveAs: joi_1.default.string()
        .valid("Home", "Work", "Other")
        .optional()
        .allow("", null),
    state: joi_1.default.string().max(100).optional().allow("", null),
    isDefault: joi_1.default.boolean().optional(),
    updatedBy: joi_1.default.number().integer().optional(),
});
// --- Product Rating Schemas ---
exports.createProductRatingSchema = joi_1.default.object({
    productId: joi_1.default.number().integer().optional(),
    totalRatings: joi_1.default.number().integer().min(0).optional(),
    givenRatings: joi_1.default.number().integer().min(1).max(5).optional(),
    message: joi_1.default.string().optional().allow("", null),
    reviewImages: joi_1.default.array().items(joi_1.default.string()).optional(),
    createdBy: joi_1.default.number().integer().optional(),
});
exports.updateProductRatingSchema = joi_1.default.object({
    productId: joi_1.default.number().integer().optional(),
    totalRatings: joi_1.default.number().integer().min(0).optional(),
    givenRatings: joi_1.default.number().integer().min(1).max(5).optional(),
    message: joi_1.default.string().optional().allow("", null),
    reviewImages: joi_1.default.array().items(joi_1.default.string()).optional(),
    updatedBy: joi_1.default.number().integer().optional(),
});
exports.productFilterSchema = joi_1.default.object({
    q: joi_1.default.string().optional().allow("", null),
    slugs: joi_1.default.string().optional().allow("", null),
    minPrice: joi_1.default.number().min(0).optional(),
    maxPrice: joi_1.default.number().min(0).optional(),
    rating: joi_1.default.number().min(1).max(5).optional(),
    categoryId: joi_1.default.number().integer().optional(),
    limit: joi_1.default.number().integer().min(1).max(100).optional(),
    cursor: joi_1.default.number().integer().optional(),
});
//# sourceMappingURL=request-schemas.js.map