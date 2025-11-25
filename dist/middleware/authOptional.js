"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authOptional = (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header) {
        req.user = null;
        next();
        return;
    }
    const token = header.split(" ")[1];
    if (!process.env.JWT_SECRET) {
        req.user = null;
        next();
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
    }
    catch (err) {
        req.user = null;
    }
    next();
};
exports.default = authOptional;
//# sourceMappingURL=authOptional.js.map