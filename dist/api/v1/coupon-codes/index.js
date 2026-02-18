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
const express_1 = __importDefault(require("express"));
const couponCodeController = __importStar(require("../../../controllers/CouponCodeController"));
const validate_request_1 = __importDefault(require("../../../middleware/validate-request"));
const request_schemas_1 = require("../../../data/request-schemas");
const router = express_1.default.Router();
// Search coupon codes by name: GET /coupon-codes/search?q=term&limit=50
router.get("/search", couponCodeController.search);
// Get all coupon codes (optional: ?limit=20, ?cursor=id)
router.get("/", couponCodeController.getAll);
// Get coupon code by ID
router.get("/:id", couponCodeController.getOne);
// Create a new coupon code
router.post("/", (0, validate_request_1.default)(request_schemas_1.createCouponCodeSchema), couponCodeController.create);
// Update a coupon code
router.put("/:id", (0, validate_request_1.default)(request_schemas_1.updateCouponCodeSchema), couponCodeController.update);
// Delete a coupon code
router.delete("/:id", couponCodeController.remove);
exports.default = router;
