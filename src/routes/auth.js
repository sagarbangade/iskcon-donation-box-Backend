const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// Admin can register users
router.post("/register", register);

// Login for everyone
router.post("/login", login);

module.exports = router;