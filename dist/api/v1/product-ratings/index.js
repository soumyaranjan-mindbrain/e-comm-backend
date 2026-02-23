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
const productRatingController = __importStar(require("../../../controllers/product-ratings/ProductRatingController"));
const validate_request_1 = __importDefault(require("../../../middleware/validate-request"));
const request_schemas_1 = require("../../../data/request-schemas");
const router = express_1.default.Router();
// Get rating statistics for a product
router.get("/product/:productId/stats", productRatingController.getStats);
// Get all ratings for a specific product
router.get("/product/:productId", productRatingController.getByProductId);
// Get all product ratings
router.get("/", productRatingController.getAll);
// Get product rating by ID
router.get("/:id", productRatingController.getOne);
// Create a new product rating
router.post("/", (0, validate_request_1.default)(request_schemas_1.createProductRatingSchema), productRatingController.create);
// Update a product rating
router.put("/:id", (0, validate_request_1.default)(request_schemas_1.updateProductRatingSchema), productRatingController.update);
// Delete a product rating
router.delete("/:id", productRatingController.remove);
exports.default = router;
