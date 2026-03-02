"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorizeAdmin = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: "unauthorized - no user profile found",
        });
        return;
    }
    // Check if role is ADMIN
    // Note: Ensure your JWT payload and Customer model have a 'role' field
    if (req.user.role !== "ADMIN") {
        res.status(403).json({
            success: false,
            message: "forbidden - admin access required",
        });
        return;
    }
    next();
};
exports.default = authorizeAdmin;
//# sourceMappingURL=authorize-admin.js.map