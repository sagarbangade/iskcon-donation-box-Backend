"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getVolunteers = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const Area_1 = __importDefault(require("../models/Area"));
const mongoose_1 = __importDefault(require("mongoose"));
const getAllUsers = async (_req, res) => {
    try {
        const users = await User_1.default.find()
            .select("-password")
            .populate("areaId", "name");
        res.json(users);
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.getAllUsers = getAllUsers;
const getVolunteers = async (_req, res) => {
    try {
        const volunteers = await User_1.default.find({ role: "volunteer" })
            .select("-password")
            .populate("areaId", "name");
        res.json(volunteers);
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.getVolunteers = getVolunteers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        // ObjectId validation
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid user ID format" });
            return;
        }
        const user = await User_1.default.findById(id)
            .select("-password")
            .populate("areaId", "name");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, role, areaId } = req.body;
        // ObjectId validation
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid user ID format" });
            return;
        }
        // ObjectId validation for areaId if provided
        if (areaId && !mongoose_1.default.Types.ObjectId.isValid(areaId)) {
            res.status(400).json({ message: "Invalid areaId format" });
            return;
        }
        // Existence check
        const user = await User_1.default.findById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Check if email is being changed and if it already exists
        if (email && email !== user.email) {
            const emailExists = await User_1.default.findOne({ email });
            if (emailExists) {
                res.status(400).json({ message: "Email already exists" });
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
        // Update user (exclude password from update)
        const updateData = {};
        if (name)
            updateData.name = name;
        if (email)
            updateData.email = email;
        if (phone !== undefined)
            updateData.phone = phone;
        if (role)
            updateData.role = role;
        if (areaId !== undefined)
            updateData.areaId = areaId;
        const updatedUser = await User_1.default.findByIdAndUpdate(id, updateData, { new: true })
            .select("-password")
            .populate("areaId", "name");
        res.json(updatedUser);
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // ObjectId validation
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid user ID format" });
            return;
        }
        // Existence check
        const user = await User_1.default.findById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Prevent deleting the last admin
        if (user.role === "admin") {
            const adminCount = await User_1.default.countDocuments({ role: "admin" });
            if (adminCount === 1) {
                res.status(400).json({ message: "Cannot delete the last admin" });
                return;
            }
        }
        // Soft delete - mark user as inactive (we'll add a status field or just delete)
        // For MVP, we'll actually delete the user
        await User_1.default.findByIdAndDelete(id);
        res.json({ message: "User deleted successfully" });
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map