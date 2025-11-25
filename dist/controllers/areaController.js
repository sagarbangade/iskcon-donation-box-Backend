"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArea = exports.updateArea = exports.getAreas = exports.createArea = void 0;
const Area_1 = __importDefault(require("../models/Area"));
const mongoose_1 = __importDefault(require("mongoose"));
const createArea = async (req, res) => {
    try {
        const { name } = req.body;
        // Required field validation
        if (!name) {
            res.status(400).json({ message: "Area name is required" });
            return;
        }
        // Check for duplicate name
        const existingArea = await Area_1.default.findOne({ name });
        if (existingArea) {
            res.status(400).json({ message: "Area with this name already exists" });
            return;
        }
        const area = await Area_1.default.create({ name });
        res.json(area);
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.createArea = createArea;
const getAreas = async (_req, res) => {
    try {
        const areas = await Area_1.default.find();
        res.json(areas);
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.getAreas = getAreas;
const updateArea = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        // ObjectId validation
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid area ID format" });
            return;
        }
        // Required field validation
        if (!name) {
            res.status(400).json({ message: "Area name is required" });
            return;
        }
        // Existence check
        const area = await Area_1.default.findById(id);
        if (!area) {
            res.status(404).json({ message: "Area not found" });
            return;
        }
        // Check for duplicate name (excluding current area)
        const existingArea = await Area_1.default.findOne({ name, _id: { $ne: id } });
        if (existingArea) {
            res.status(400).json({ message: "Area with this name already exists" });
            return;
        }
        const updatedArea = await Area_1.default.findByIdAndUpdate(id, { name }, { new: true });
        res.json(updatedArea);
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.updateArea = updateArea;
const deleteArea = async (req, res) => {
    try {
        const { id } = req.params;
        // ObjectId validation
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid area ID format" });
            return;
        }
        // Existence check
        const area = await Area_1.default.findById(id);
        if (!area) {
            res.status(404).json({ message: "Area not found" });
            return;
        }
        // Soft delete - add a deleted flag or remove from active list
        // For now, we'll actually delete it, but you can add a status field if needed
        await Area_1.default.findByIdAndDelete(id);
        res.json({ message: "Area deleted successfully" });
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.deleteArea = deleteArea;
//# sourceMappingURL=areaController.js.map