const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { getVolunteers } = require("../controllers/userController");

// Admin gets all volunteers
router.get("/volunteers", auth, role(["admin"]), getVolunteers);

module.exports = router;

