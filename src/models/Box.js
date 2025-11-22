const mongoose = require("mongoose");

const boxSchema = new mongoose.Schema({
  locationName: { type: String, required: true },
  caretakerName: String,
  caretakerPhone: String,

  locationLink: String,    // <-- we added this for simple Gmap link

  areaId: { type: mongoose.Schema.Types.ObjectId, ref: "Area" },
  assignedVolunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  lastCollectionAt: Date,
  nextCollectionAt: Date,

  status: { type: String, enum: ["active", "inactive"], default: "active" }

}, { timestamps: true });

module.exports = mongoose.model("Box", boxSchema);