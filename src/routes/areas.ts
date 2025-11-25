import express, { Router } from "express";
import auth from "../middleware/authMiddleware";
import role from "../middleware/roleMiddleware";
import { createArea, getAreas, updateArea, deleteArea } from "../controllers/areaController";

const router: Router = express.Router();

// Only admin can create areas
router.post("/", auth, role(["admin"]), createArea);

// Admin can see list
router.get("/", auth, role(["admin"]), getAreas);

// Admin updates area
router.put("/:id", auth, role(["admin"]), updateArea);

// Admin deletes area
router.delete("/:id", auth, role(["admin"]), deleteArea);

export default router;

