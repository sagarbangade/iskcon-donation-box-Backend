import express, { Router } from "express";
import auth from "../middleware/authMiddleware";
import role from "../middleware/roleMiddleware";
import {
  createBox,
  getAllBoxes,
  getBoxById,
  getBoxesByVolunteer,
  updateBox,
  deleteBox,
} from "../controllers/boxController";

const router: Router = express.Router();

// Admin and volunteers can create boxes (with different permissions)
router.post("/", auth, createBox);

// Admin gets all boxes
router.get("/", auth, role(["admin"]), getAllBoxes);

// Volunteer gets their boxes (must come before /:id to avoid route conflict)
router.get("/by-volunteer/:id", auth, getBoxesByVolunteer);

// Get single box by ID (volunteers can only see their assigned boxes)
router.get("/:id", auth, getBoxById);

// Admin updates box
router.put("/:id", auth, role(["admin"]), updateBox);

// Admin deletes box (soft delete)
router.delete("/:id", auth, role(["admin"]), deleteBox);

export default router;

