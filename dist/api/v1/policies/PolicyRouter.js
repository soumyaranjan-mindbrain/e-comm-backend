"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PolicyController_1 = require("../../../controllers/content/PolicyController");
const router = (0, express_1.Router)();
// Public routes
router.get("/terms", PolicyController_1.PolicyController.getTerms);
router.get("/privacy", PolicyController_1.PolicyController.getPrivacy);
router.get("/returns", PolicyController_1.PolicyController.getReturns);
router.get("/shipping", PolicyController_1.PolicyController.getShipping);
exports.default = router;
