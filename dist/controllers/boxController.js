"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBox = exports.updateBox = exports.getBoxesByVolunteer = exports.getBoxById = exports.getAllBoxes = exports.createBox = void 0;
const Box_1 = __importDefault(require("../models/Box"));
const Area_1 = __importDefault(require("../models/Area"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const createBox = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const { locationName, areaId, assignedVolunteerId, status } = req.body;
        // Required field validation
        if (!locationName) {
            res.status(400).json({ message: "Location name is required" });
            return;
        }
        // Prepare box data
        let boxData = {
            locationName,
            caretakerName: req.body.caretakerName,
            caretakerPhone: req.body.caretakerPhone,
            locationLink: req.body.locationLink,
            lastCollectionAt: req.body.lastCollectionAt,
            nextCollectionAt: req.body.nextCollectionAt,
        };
        // Admin logic: can set areaId and assignedVolunteerId
        if (req.user.role === "admin") {
            // ObjectId validation
            if (areaId && !mongoose_1.default.Types.ObjectId.isValid(areaId)) {
                res.status(400).json({ message: "Invalid areaId format" });
                return;
            }
            if (assignedVolunteerId && !mongoose_1.default.Types.ObjectId.isValid(assignedVolunteerId)) {
                res.status(400).json({ message: "Invalid assignedVolunteerId format" });
                return;
            }
            // Existence checks
            if (areaId) {
                const area = await Area_1.default.findById(areaId);
                if (!area) {
                    res.status(404).json({ message: "Area not found" });
                    return;
                }
                boxData.areaId = areaId;
            }
            if (assignedVolunteerId) {
                const volunteer = await User_1.default.findById(assignedVolunteerId);
                if (!volunteer) {
                    res.status(404).json({ message: "Volunteer not found" });
                    return;
                }
                boxData.assignedVolunteerId = assignedVolunteerId;
            }
            if (status) {
                boxData.status = status;
            }
        }
        else {
            // Volunteer logic: automatically assign to their area and themselves
            // Validate that volunteer has an assigned area
            if (!req.user.id) {
                res.status(400).json({ message: "Invalid user ID" });
                return;
            }
            const volunteer = await User_1.default.findById(req.user.id);
            if (!volunteer) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            if (!volunteer.areaId) {
                res.status(400).json({
                    message: "You must be assigned to an area before creating boxes. Please contact an admin.",
                });
                return;
            }
            // Verify area exists
            const area = await Area_1.default.findById(volunteer.areaId);
            if (!area) {
                res.status(404).json({ message: "Your assigned area no longer exists. Please contact an admin." });
                return;
            }
            // Automatically set areaId and assignedVolunteerId for volunteers
            boxData.areaId = volunteer.areaId;
            boxData.assignedVolunteerId = req.user.id;
            boxData.status = "active"; // Volunteers can only create active boxes
            // Volunteers cannot override these fields - ignore if provided
            if (req.body.areaId || req.body.assignedVolunteerId || req.body.status) {
                // Silently ignore these fields for volunteers
            }
        }
        const box = await Box_1.default.create(boxData);
        res.json(box);
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.createBox = createBox;
const getAllBoxes = async (_req, res) => {
    try {
        const boxes = await Box_1.default.find()
            .populate("areaId", "name")
            .populate("assignedVolunteerId", "name email");
        res.json(boxes);
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.getAllBoxes = getAllBoxes;
const getBoxById = async (req, res) => {
    try {
        const { id } = req.params;
        // ObjectId validation
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid box ID format" });
            return;
        }
        const box = await Box_1.default.findById(id)
            .populate("areaId", "name")
            .populate("assignedVolunteerId", "name email");
        if (!box) {
            res.status(404).json({ message: "Box not found" });
            return;
        }
        // Authorization: Volunteers can only view boxes assigned to them
        if (!req.user) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        if (req.user.role !== "admin" && box.assignedVolunteerId?.toString() !== req.user.id) {
            res.status(403).json({
                message: "Access denied. You can only view boxes assigned to you.",
            });
            return;
        }
        res.json(box);
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.getBoxById = getBoxById;
const getBoxesByVolunteer = async (req, res) => {
    try {
        const volunteerId = req.params.id;
        // ObjectId validation
        if (!mongoose_1.default.Types.ObjectId.isValid(volunteerId)) {
            res.status(400).json({ message: "Invalid volunteer ID format" });
            return;
        }
        // Authorization: Volunteers can only view their own boxes
        if (!req.user) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        if (req.user.role !== "admin" && req.user.id !== volunteerId) {
            res.status(403).json({ message: "Access denied. You can only view your own boxes." });
            return;
        }
        const boxes = await Box_1.default.find({ assignedVolunteerId: volunteerId }).populate("areaId", "name");
        res.json(boxes);
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.getBoxesByVolunteer = getBoxesByVolunteer;
const updateBox = async (req, res) => {
    try {
        const { id } = req.params;
        // ObjectId validation
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid box ID format" });
            return;
        }
        // ObjectId validation for nested fields if provided
        if (req.body.areaId && !mongoose_1.default.Types.ObjectId.isValid(req.body.areaId)) {
            res.status(400).json({ message: "Invalid areaId format" });
            return;
        }
        if (req.body.assignedVolunteerId &&
            !mongoose_1.default.Types.ObjectId.isValid(req.body.assignedVolunteerId)) {
            res.status(400).json({ message: "Invalid assignedVolunteerId format" });
            return;
        }
        // Existence check for box
        const existingBox = await Box_1.default.findById(id);
        if (!existingBox) {
            res.status(404).json({ message: "Box not found" });
            return;
        }
        // Existence checks for nested references if provided
        if (req.body.areaId) {
            const area = await Area_1.default.findById(req.body.areaId);
            if (!area) {
                res.status(404).json({ message: "Area not found" });
                return;
            }
        }
        if (req.body.assignedVolunteerId) {
            const volunteer = await User_1.default.findById(req.body.assignedVolunteerId);
            if (!volunteer) {
                res.status(404).json({ message: "Volunteer not found" });
                return;
            }
        }
        const box = await Box_1.default.findByIdAndUpdate(id, req.body, { new: true });
        res.json(box);
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.updateBox = updateBox;
const deleteBox = async (req, res) => {
    try {
        const { id } = req.params;
        // ObjectId validation
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid box ID format" });
            return;
        }
        // Existence check
        const box = await Box_1.default.findById(id);
        if (!box) {
            res.status(404).json({ message: "Box not found" });
            return;
        }
        // Soft delete - mark as inactive
        box.status = "inactive";
        await box.save();
        res.json({ message: "Box deleted successfully", box });
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message: errorMessage });
    }
};
exports.deleteBox = deleteBox;
//# sourceMappingURL=boxController.js.map