const Box = require("../models/Box");
const Area = require("../models/Area");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.createBox = async (req, res) => {
  try {
    const { locationName, areaId, assignedVolunteerId } = req.body;

    // Required field validation
    if (!locationName) {
      return res.status(400).json({ message: "Location name is required" });
    }

    // ObjectId validation
    if (areaId && !mongoose.Types.ObjectId.isValid(areaId)) {
      return res.status(400).json({ message: "Invalid areaId format" });
    }
    if (assignedVolunteerId && !mongoose.Types.ObjectId.isValid(assignedVolunteerId)) {
      return res.status(400).json({ message: "Invalid assignedVolunteerId format" });
    }

    // Existence checks
    if (areaId) {
      const area = await Area.findById(areaId);
      if (!area) {
        return res.status(404).json({ message: "Area not found" });
      }
    }
    if (assignedVolunteerId) {
      const volunteer = await User.findById(assignedVolunteerId);
      if (!volunteer) {
        return res.status(404).json({ message: "Volunteer not found" });
      }
    }

    const box = await Box.create(req.body);
    res.json(box);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllBoxes = async (req, res) => {
  try {
    const boxes = await Box.find()
      .populate("areaId", "name")
      .populate("assignedVolunteerId", "name email");
    res.json(boxes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBoxById = async (req, res) => {
  try {
    const { id } = req.params;

    // ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid box ID format" });
    }

    const box = await Box.findById(id)
      .populate("areaId", "name")
      .populate("assignedVolunteerId", "name email");

    if (!box) {
      return res.status(404).json({ message: "Box not found" });
    }

    res.json(box);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBoxesByVolunteer = async (req, res) => {
  try {
    const volunteerId = req.params.id;

    // ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(volunteerId)) {
      return res.status(400).json({ message: "Invalid volunteer ID format" });
    }

    // Authorization: Volunteers can only view their own boxes
    if (req.user.role !== "admin" && req.user.id !== volunteerId) {
      return res.status(403).json({ message: "Access denied. You can only view your own boxes." });
    }

    const boxes = await Box.find({ assignedVolunteerId: volunteerId })
      .populate("areaId", "name");

    res.json(boxes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBox = async (req, res) => {
  try {
    const { id } = req.params;

    // ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid box ID format" });
    }

    // ObjectId validation for nested fields if provided
    if (req.body.areaId && !mongoose.Types.ObjectId.isValid(req.body.areaId)) {
      return res.status(400).json({ message: "Invalid areaId format" });
    }
    if (req.body.assignedVolunteerId && !mongoose.Types.ObjectId.isValid(req.body.assignedVolunteerId)) {
      return res.status(400).json({ message: "Invalid assignedVolunteerId format" });
    }

    // Existence check for box
    const existingBox = await Box.findById(id);
    if (!existingBox) {
      return res.status(404).json({ message: "Box not found" });
    }

    // Existence checks for nested references if provided
    if (req.body.areaId) {
      const area = await Area.findById(req.body.areaId);
      if (!area) {
        return res.status(404).json({ message: "Area not found" });
      }
    }
    if (req.body.assignedVolunteerId) {
      const volunteer = await User.findById(req.body.assignedVolunteerId);
      if (!volunteer) {
        return res.status(404).json({ message: "Volunteer not found" });
      }
    }

    const box = await Box.findByIdAndUpdate(id, req.body, { new: true });
    res.json(box);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBox = async (req, res) => {
  try {
    const { id } = req.params;

    // ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid box ID format" });
    }

    // Existence check
    const box = await Box.findById(id);
    if (!box) {
      return res.status(404).json({ message: "Box not found" });
    }

    // Soft delete - mark as inactive
    box.status = "inactive";
    await box.save();

    res.json({ message: "Box deleted successfully", box });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};