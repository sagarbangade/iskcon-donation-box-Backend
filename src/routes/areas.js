const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { createArea, getAreas, updateArea, deleteArea } = require("../controllers/areaController");

// Only admin can create areas
router.post("/", auth, role(["admin"]), createArea);

// Everyone can see list
router.get("/", auth, getAreas);

// Admin updates area
router.put("/:id", auth, role(["admin"]), updateArea);

// Admin deletes area
router.delete("/:id", auth, role(["admin"]), deleteArea);

module.exports = router;