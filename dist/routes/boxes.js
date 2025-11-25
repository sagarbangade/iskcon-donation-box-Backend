"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const roleMiddleware_1 = __importDefault(require("../middleware/roleMiddleware"));
const boxController_1 = require("../controllers/boxController");
const router = express_1.default.Router();
// Admin and volunteers can create boxes (with different permissions)
router.post("/", authMiddleware_1.default, boxController_1.createBox);
// Admin gets all boxes
router.get("/", authMiddleware_1.default, (0, roleMiddleware_1.default)(["admin"]), boxController_1.getAllBoxes);
// Volunteer gets their boxes (must come before /:id to avoid route conflict)
router.get("/by-volunteer/:id", authMiddleware_1.default, boxController_1.getBoxesByVolunteer);
// Get single box by ID (volunteers can only see their assigned boxes)
router.get("/:id", authMiddleware_1.default, boxController_1.getBoxById);
// Admin updates box
router.put("/:id", authMiddleware_1.default, (0, roleMiddleware_1.default)(["admin"]), boxController_1.updateBox);
// Admin deletes box (soft delete)
router.delete("/:id", authMiddleware_1.default, (0, roleMiddleware_1.default)(["admin"]), boxController_1.deleteBox);
exports.default = router;
//# sourceMappingURL=boxes.js.map