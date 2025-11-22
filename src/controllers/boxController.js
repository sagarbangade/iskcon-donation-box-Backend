const Box = require("../models/Box");

exports.createBox = async (req, res) => {
  try {
    const box = await Box.create(req.body);
    res.json(box);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBoxesByVolunteer = async (req, res) => {
  try {
    const volunteerId = req.params.id;
    const boxes = await Box.find({ assignedVolunteerId: volunteerId })
      .populate("areaId", "name");

    res.json(boxes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBox = async (req, res) => {
  try {
    const box = await Box.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(box);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};