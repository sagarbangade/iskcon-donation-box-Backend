"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCollection = exports.updateCollection = exports.getCollectionsByBox = exports.getAllCollections = exports.addCollection = void 0;
const Collection_1 = __importDefault(require("../models/Collection"));
const Box_1 = __importDefault(require("../models/Box"));
const mongoose_1 = __importDefault(require("mongoose"));
const addCollection = async (req, res) => {
    try {
        const { boxId, volunteerId, visitType } = req.body;
        // Required field validation
        if (!boxId || !visitType) {
            res.status(400).json({ message: "boxId and visitType are required" });
            return;
        }
        // ObjectId validation
        if (!mongoose_1.default.Types.ObjectId.isValid(boxId)) {
            res.status(400).json({ message: "Invalid boxId format" });
            return;
        }
        if (volunteerId && !mongoose_1.default.Types.ObjectId.isValid(volunteerId)) {
            res.status(400).json({ message: "Invalid volunteerId format" });
            return;
        }
        if (req.body.areaId && !mongoose_1.default.Types.ObjectId.isValid(req.body.areaId)) {
            res.status(400).json({ message: "Invalid areaId format" });
            return;
        }
        // Existence check for box and active status
        const box = await Box_1.default.findById(boxId);
        if (!box || box.status !== "active") {
            res.status(400).json({ message: "Box is inactive or does not exist" });
            return;
        }
        // Authorization: Volunteers can only add collections for boxes assigned to them
        if (!req.user) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const collectionVolunteerId = volunteerId || req.user.id;
        if (req.user.role !== "admin" &&
            box.assignedVolunteerId?.toString() !== req.user.id) {
            res.status(403).json({
                message: "Access denied. You can only add collections for boxes assigned to you.",
            });
            return;
        }
        // Set volunteerId from token if not provided
        const entryData = {
            ...req.body,
            volunteerId: collectionVolunteerId,
            areaId: req.body.areaId || box.areaId,
        };
        const entry = await Collection_1.default.create(entryData);
        res.json(entry);
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.addCollection = addCollection;
const getAllCollections = async (_req, res) => {
    try {
        const collections = await Collection_1.default.find()
            .populate("boxId", "locationName")
            .populate("volunteerId", "name email")
            .populate("areaId", "name")
            .sort({ visitedAt: -1 });
        res.json(collections);
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.getAllCollections = getAllCollections;
const getCollectionsByBox = async (req, res) => {
    try {
        const { id } = req.params;
        // ObjectId validation
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid box ID format" });
            return;
        }
        // Existence check for box
        const box = await Box_1.default.findById(id);
        if (!box) {
            res.status(404).json({ message: "Box not found" });
            return;
        }
        // Authorization: Volunteers can only view collections for boxes assigned to them
        if (!req.user) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        if (req.user.role !== "admin" && box.assignedVolunteerId?.toString() !== req.user.id) {
            res.status(403).json({
                message: "Access denied. You can only view collections for boxes assigned to you.",
            });
            return;
        }
        const entries = await Collection_1.default.find({ boxId: id })
            .populate("volunteerId", "name email")
            .sort({ visitedAt: -1 });
        res.json(entries);
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.getCollectionsByBox = getCollectionsByBox;
const updateCollection = async (req, res) => {
    try {
        const { id } = req.params;
        const { boxId, amount, visitType, note } = req.body;
        // ObjectId validation
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid collection ID format" });
            return;
        }
        // Existence check
        const collection = await Collection_1.default.findById(id);
        if (!collection) {
            res.status(404).json({ message: "Collection not found" });
            return;
        }
        // If boxId is being changed, validate it
        if (boxId) {
            if (!mongoose_1.default.Types.ObjectId.isValid(boxId)) {
                res.status(400).json({ message: "Invalid boxId format" });
                return;
            }
            const box = await Box_1.default.findById(boxId);
            if (!box || box.status !== "active") {
                res.status(400).json({ message: "Box is inactive or does not exist" });
                return;
            }
        }
        // Update collection
        const updateData = {};
        if (boxId)
            updateData.boxId = boxId;
        if (amount !== undefined)
            updateData.amount = amount;
        if (visitType)
            updateData.visitType = visitType;
        if (note !== undefined)
            updateData.note = note;
        const updatedCollection = await Collection_1.default.findByIdAndUpdate(id, updateData, { new: true })
            .populate("boxId", "locationName")
            .populate("volunteerId", "name email")
            .populate("areaId", "name");
        res.json(updatedCollection);
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.updateCollection = updateCollection;
const deleteCollection = async (req, res) => {
    try {
        const { id } = req.params;
        // ObjectId validation
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid collection ID format" });
            return;
        }
        // Existence check
        const collection = await Collection_1.default.findById(id);
        if (!collection) {
            res.status(404).json({ message: "Collection not found" });
            return;
        }
        await Collection_1.default.findByIdAndDelete(id);
        res.json({ message: "Collection deleted successfully" });
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.deleteCollection = deleteCollection;
//# sourceMappingURL=collectionController.js.map