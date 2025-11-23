const Collection = require("../models/Collection");
const Box = require("../models/Box");
const mongoose = require("mongoose");

exports.addCollection = async (req, res) => {
  try {
    const { boxId, volunteerId, visitType } = req.body;

    // Required field validation
    if (!boxId || !visitType) {
      return res.status(400).json({ message: "boxId and visitType are required" });
    }

    // ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(boxId)) {
      return res.status(400).json({ message: "Invalid boxId format" });
    }
    if (volunteerId && !mongoose.Types.ObjectId.isValid(volunteerId)) {
      return res.status(400).json({ message: "Invalid volunteerId format" });
    }
    if (req.body.areaId && !mongoose.Types.ObjectId.isValid(req.body.areaId)) {
      return res.status(400).json({ message: "Invalid areaId format" });
    }

    // Existence check for box and active status
    const box = await Box.findById(boxId);
    if (!box || box.status !== "active") {
      return res.status(400).json({ message: "Box is inactive or does not exist" });
    }

    // Authorization: Volunteers can only add collections for boxes assigned to them
    const collectionVolunteerId = volunteerId || req.user.id;
    if (req.user.role !== "admin" && box.assignedVolunteerId?.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: "Access denied. You can only add collections for boxes assigned to you." 
      });
    }

    // Set volunteerId from token if not provided
    const entryData = {
      ...req.body,
      volunteerId: collectionVolunteerId,
      areaId: req.body.areaId || box.areaId,
    };

    const entry = await Collection.create(entryData);
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find()
      .populate("boxId", "locationName")
      .populate("volunteerId", "name email")
      .populate("areaId", "name")
      .sort({ visitedAt: -1 });
    res.json(collections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCollectionsByBox = async (req, res) => {
  try {
    const { id } = req.params;

    // ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid box ID format" });
    }

    // Existence check for box
    const box = await Box.findById(id);
    if (!box) {
      return res.status(404).json({ message: "Box not found" });
    }

    const entries = await Collection.find({ boxId: id })
      .populate("volunteerId", "name email")
      .sort({ visitedAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};