"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ContactController_1 = require("../../../controllers/content/ContactController");
const router = (0, express_1.Router)();
// Public routes
router.get("/info", ContactController_1.ContactController.getInfo);
router.post("/enquiry", ContactController_1.ContactController.submitEnquiry);
exports.default = router;
