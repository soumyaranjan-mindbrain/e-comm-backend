"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const OrderReturnController_1 = require("../../../controllers/return/OrderReturnController");
const authenticate_user_1 = __importDefault(require("../../../middleware/authenticate-user"));
const router = express_1.default.Router();
// All return routes are protected
router.use(authenticate_user_1.default);
// POST /v1/order-returns → create a return request
router.post("/", OrderReturnController_1.createReturnRequest);
// GET /v1/order-returns → get all return requests
router.get("/", OrderReturnController_1.getReturnRequests);
// GET /v1/order-returns/:returnId → get return by ID
router.get("/:returnId", OrderReturnController_1.getReturnById);
// PATCH /v1/order-returns/:returnId → approve/reject return
router.patch("/:returnId", OrderReturnController_1.updateReturnStatus);
exports.default = router;
//# sourceMappingURL=OrderReturnRouter.js.map