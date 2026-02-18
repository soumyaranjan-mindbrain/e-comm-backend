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
const userAddressController = __importStar(require("../../../controllers/UserAddressController"));
const validate_request_1 = __importDefault(require("../../../middleware/validate-request"));
const authenticate_user_1 = __importDefault(require("../../../middleware/authenticate-user"));
const request_schemas_1 = require("../../../data/request-schemas");
const router = express_1.default.Router();
router.use(authenticate_user_1.default);
router.get("/me", userAddressController.getMine);
router.get("/:id", userAddressController.getOne);
router.post("/", (0, validate_request_1.default)(request_schemas_1.createUserAddressSchema), userAddressController.create);
router.put("/:id", (0, validate_request_1.default)(request_schemas_1.updateUserAddressSchema), userAddressController.update);
router.delete("/:id", userAddressController.remove);
exports.default = router;
//# sourceMappingURL=index.js.map