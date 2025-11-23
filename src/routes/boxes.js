const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const { 
  createBox, 
  getAllBoxes, 
  getBoxById, 
  getBoxesByVolunteer, 
  updateBox, 
  deleteBox 
} = require("../controllers/boxController");

// Admin creates box
router.post("/", auth, role(["admin"]), createBox);

// Admin gets all boxes
router.get("/", auth, role(["admin"]), getAllBoxes);

// Volunteer gets their boxes (must come before /:id to avoid route conflict)
router.get("/by-volunteer/:id", auth, getBoxesByVolunteer);

// Get single box by ID
router.get("/:id", auth, getBoxById);

// Admin updates box
router.put("/:id", auth, role(["admin"]), updateBox);

// Admin deletes box (soft delete)
router.delete("/:id", auth, role(["admin"]), deleteBox);

module.exports = router;