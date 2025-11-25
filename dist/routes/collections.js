"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const roleMiddleware_1 = __importDefault(require("../middleware/roleMiddleware"));
const collectionController_1 = require("../controllers/collectionController");
const router = express_1.default.Router();
// Volunteer adds collection entry
router.post("/", authMiddleware_1.default, collectionController_1.addCollection);
// Admin gets all collections
router.get("/", authMiddleware_1.default, (0, roleMiddleware_1.default)(["admin"]), collectionController_1.getAllCollections);
// Admin/volunteer view history by box
router.get("/box/:id", authMiddleware_1.default, collectionController_1.getCollectionsByBox);
// Admin updates collection
router.put("/:id", authMiddleware_1.default, (0, roleMiddleware_1.default)(["admin"]), collectionController_1.updateCollection);
// Admin deletes collection
router.delete("/:id", authMiddleware_1.default, (0, roleMiddleware_1.default)(["admin"]), collectionController_1.deleteCollection);
exports.default = router;
//# sourceMappingURL=collections.js.map