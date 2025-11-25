import express, { Router } from "express";
import { register, login } from "../controllers/authController";
import authOptional from "../middleware/authOptional";

const router: Router = express.Router();

// Admin can register users
router.post("/register", authOptional, register);

// Login for everyone
router.post("/login", login);

export default router;

