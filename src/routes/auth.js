const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// Admin can register users
const authOptional = require("../middleware/authOptional");

router.post("/register", authOptional, register);

// Login for everyone
router.post("/login", login);

module.exports = router;