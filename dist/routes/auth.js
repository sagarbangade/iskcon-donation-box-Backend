"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authOptional_1 = __importDefault(require("../middleware/authOptional"));
const router = express_1.default.Router();
// Admin can register users
router.post("/register", authOptional_1.default, authController_1.register);
// Login for everyone
router.post("/login", authController_1.login);
exports.default = router;
//# sourceMappingURL=auth.js.map