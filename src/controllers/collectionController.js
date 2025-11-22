const Collection = require("../models/Collection");

exports.addCollection = async (req, res) => {
  try {
    const entry = await Collection.create(req.body);
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCollectionsByBox = async (req, res) => {
  try {
    const entries = await Collection.find({ boxId: req.params.id })
      .sort({ visitedAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};