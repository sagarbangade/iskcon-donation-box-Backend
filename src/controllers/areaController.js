const Area = require("../models/Area");

exports.createArea = async (req, res) => {
  try {
    const { name } = req.body;
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