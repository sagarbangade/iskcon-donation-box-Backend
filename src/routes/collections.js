const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const { addCollection, getAllCollections, getCollectionsByBox } = require("../controllers/collectionController");

// Volunteer adds collection entry
router.post("/", auth, addCollection);

// Admin gets all collections
router.get("/", auth, role(["admin"]), getAllCollections);

// Admin/volunteer view history by box
router.get("/box/:id", auth, getCollectionsByBox);

module.exports = router;