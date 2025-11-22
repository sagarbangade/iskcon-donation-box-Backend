const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const { createBox, getBoxesByVolunteer, updateBox } = require("../controllers/boxController");

// Admin creates box
router.post("/", auth, role(["admin"]), createBox);

// Volunteer gets their boxes
router.get("/by-volunteer/:id", auth, getBoxesByVolunteer);

// Admin updates box
router.put("/:id", auth, role(["admin"]), updateBox);

module.exports = router;