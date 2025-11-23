const Area = require("../models/Area");
const mongoose = require("mongoose");

exports.createArea = async (req, res) => {
  try {
    const { name } = req.body;

    // Required field validation
    if (!name) {
      return res.status(400).json({ message: "Area name is required" });
    }

    // Check for duplicate name
    const existingArea = await Area.findOne({ name });
    if (existingArea) {
      return res.status(400).json({ message: "Area with this name already exists" });
    }

    const area = await Area.create({ name });
    res.json(area);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAreas = async (req, res) => {
  try {
    const areas = await Area.find();
    res.json(areas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateArea = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid area ID format" });
    }

    // Required field validation
    if (!name) {
      return res.status(400).json({ message: "Area name is required" });
    }

    // Existence check
    const area = await Area.findById(id);
    if (!area) {
      return res.status(404).json({ message: "Area not found" });
    }

    // Check for duplicate name (excluding current area)
    const existingArea = await Area.findOne({ name, _id: { $ne: id } });
    if (existingArea) {
      return res.status(400).json({ message: "Area with this name already exists" });
    }

    const updatedArea = await Area.findByIdAndUpdate(id, { name }, { new: true });
    res.json(updatedArea);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteArea = async (req, res) => {
  try {
    const { id } = req.params;

    // ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid area ID format" });
    }

    // Existence check
    const area = await Area.findById(id);
    if (!area) {
      return res.status(404).json({ message: "Area not found" });
    }

    // Soft delete - add a deleted flag or remove from active list
    // For now, we'll actually delete it, but you can add a status field if needed
    await Area.findByIdAndDelete(id);

    res.json({ message: "Area deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};