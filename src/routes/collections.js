const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const { addCollection, getCollectionsByBox } = require("../controllers/collectionController");

// Volunteer adds collection entry
router.post("/", auth, addCollection);

// Admin/volunteer view history
router.get("/box/:id", auth, getCollectionsByBox);

module.exports = router;