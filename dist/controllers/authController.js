"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const Area_1 = __importDefault(require("../models/Area"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const register = async (req, res) => {
    try {
        const { name, email, phone, password, role, areaId } = req.body;
        // Required field validation
        if (!name || !email || !password) {
            res.status(400).json({ message: "Name, email, and password are required" });
            return;
        }
        // ObjectId validation for areaId if provided
        if (areaId && !mongoose_1.default.Types.ObjectId.isValid(areaId)) {
            res.status(400).json({ message: "Invalid areaId format" });
            return;
        }
        // Check if email already exists
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        // Check if any admin exists
        const adminExists = await User_1.default.findOne({ role: "admin" });
        // CASE 1 → No admin exists yet → allow only admin creation
        if (!adminExists) {
            if (role !== "admin") {
                res.status(400).json({
                    message: "First user must be an admin",
                });
                return;
            }
            // proceed (no token required)
        }
        else {
            // CASE 2 → Admin exists → only logged-in admin can create users
            if (!req.user || req.user.role !== "admin") {
                res.status(403).json({
                    message: "Only admin can create users",
                });
                return;
            }
        }
        // Verify area exists if areaId provided
        if (areaId) {
            const area = await Area_1.default.findById(areaId);
            if (!area) {
                res.status(404).json({ message: "Area not found" });
                return;
            }
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Create user
        const user = await User_1.default.create({
            name,
            email,
            phone,
            role,
            areaId,
            password: hashedPassword,
        });
        res.json({
            message: "User registered successfully",
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                areaId: user.areaId?.toString(),
            },
        });
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Required field validation
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        // Find user
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Compare password
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match) {
            res.status(400).json({ message: "Invalid password" });
            return;
        }
        // Create JWT token
        if (!process.env.JWT_SECRET) {
            res.status(500).json({ message: "JWT_SECRET is not configured" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                areaId: user.areaId?.toString(),
            },
        });
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map