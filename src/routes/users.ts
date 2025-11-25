import express, { Router } from "express";
import auth from "../middleware/authMiddleware";
import role from "../middleware/roleMiddleware";
import {
  getAllUsers,
  getVolunteers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router: Router = express.Router();

// Admin gets all users
router.get("/", auth, role(["admin"]), getAllUsers);

// Admin gets all volunteers
router.get("/volunteers", auth, role(["admin"]), getVolunteers);

// Admin gets user by ID
router.get("/:id", auth, role(["admin"]), getUserById);

// Admin updates user
router.put("/:id", auth, role(["admin"]), updateUser);

// Admin deletes user
router.delete("/:id", auth, role(["admin"]), deleteUser);

export default router;

