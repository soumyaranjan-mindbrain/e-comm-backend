"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = resolveCompanyContext;
const prisma_client_1 = __importDefault(require("../prisma-client"));
const COMPANY_CONTEXT_ERROR = {
    success: false,
    message: "user identity could not be verified",
};
async function resolveCompanyContext(req, res, next) {
    try {
        if (req.companyContext?.comId) {
            next();
            return;
        }
        let comId = req.user?.comId;
        if (!comId && req.user?.id) {
            console.log(`WARNING: comId missing in token for user ${req.user.id}. Falling back to db lookup.`);
            const customer = await prisma_client_1.default.customer.findUnique({
                where: { id: req.user.id },
            });
            comId = customer?.comId || req.user.id;
        }
        if (!comId) {
            res.status(500).json(COMPANY_CONTEXT_ERROR);
            return;
        }
        req.companyContext = { comId };
        next();
    }
    catch (error) {
        next(error);
    }
}
