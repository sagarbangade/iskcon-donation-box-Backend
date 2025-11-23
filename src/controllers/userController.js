const User = require("../models/User");

exports.getVolunteers = async (req, res) => {
  try {
    const volunteers = await User.find({ role: "volunteer" })
      .select("-password")
      .populate("areaId", "name");

    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

