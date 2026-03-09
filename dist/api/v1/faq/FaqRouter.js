"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FaqController_1 = require("../../../controllers/faq/FaqController");
const router = (0, express_1.Router)();
// Public routes
router.get("/", FaqController_1.FaqController.getFaqs);
router.get("/categories", FaqController_1.FaqController.getFaqCategories);
exports.default = router;
