import express, { Router } from "express";
import auth from "../middleware/authMiddleware";
import role from "../middleware/roleMiddleware";
import {
  addCollection,
  getAllCollections,
  getCollectionsByBox,
  updateCollection,
  deleteCollection,
} from "../controllers/collectionController";

const router: Router = express.Router();

// Volunteer adds collection entry
router.post("/", auth, addCollection);

// Admin gets all collections
router.get("/", auth, role(["admin"]), getAllCollections);

// Admin/volunteer view history by box
router.get("/box/:id", auth, getCollectionsByBox);

// Admin updates collection
router.put("/:id", auth, role(["admin"]), updateCollection);

// Admin deletes collection
router.delete("/:id", auth, role(["admin"]), deleteCollection);

export default router;

