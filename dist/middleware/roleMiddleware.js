"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ message: "Access denied. Not enough permissions." });
            return;
        }
        next();
    };
};
exports.default = roleMiddleware;
//# sourceMappingURL=roleMiddleware.js.map