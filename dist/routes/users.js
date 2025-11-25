"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const roleMiddleware_1 = __importDefault(require("../middleware/roleMiddleware"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// Admin gets all users
router.get("/", authMiddleware_1.default, (0, roleMiddleware_1.default)(["admin"]), userController_1.getAllUsers);
// Admin gets all volunteers
router.get("/volunteers", authMiddleware_1.default, (0, roleMiddleware_1.default)(["admin"]), userController_1.getVolunteers);
// Admin gets user by ID
router.get("/:id", authMiddleware_1.default, (0, roleMiddleware_1.default)(["admin"]), userController_1.getUserById);
// Admin updates user
router.put("/:id", authMiddleware_1.default, (0, roleMiddleware_1.default)(["admin"]), userController_1.updateUser);
// Admin deletes user
router.delete("/:id", authMiddleware_1.default, (0, roleMiddleware_1.default)(["admin"]), userController_1.deleteUser);
exports.default = router;
//# sourceMappingURL=users.js.map