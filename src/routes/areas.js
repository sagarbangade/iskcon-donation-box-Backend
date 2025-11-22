const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { createArea, getAreas } = require("../controllers/areaController");

// Only admin can create areas
router.post("/", auth, role(["admin"]), createArea);

// Everyone can see list
router.get("/", auth, getAreas);

module.exports = router;