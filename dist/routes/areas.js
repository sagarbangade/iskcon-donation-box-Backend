"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const roleMiddleware_1 = __importDefault(require("../middleware/roleMiddleware"));
const areaController_1 = require("../controllers/areaController");
const router = express_1.default.Router();
// Only admin can create areas
router.post("/", authMiddleware_1.default, (0, roleMiddleware_1.default)(["admin"]), areaController_1.createArea);
// Admin can see list
router.get("/", authMiddleware_1.default, (0, roleMiddleware_1.default)(["admin"]), areaController_1.getAreas);
// Admin updates area
router.put("/:id", authMiddleware_1.default, (0, roleMiddleware_1.default)(["admin"]), areaController_1.updateArea);
// Admin deletes area
router.delete("/:id", authMiddleware_1.default, (0, roleMiddleware_1.default)(["admin"]), areaController_1.deleteArea);
exports.default = router;
//# sourceMappingURL=areas.js.map