const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  boxId: { type: mongoose.Schema.Types.ObjectId, ref: "Box", required: true },
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  areaId: { type: mongoose.Schema.Types.ObjectId, ref: "Area" },

  amount: Number,
  visitType: {
    type: String,
    enum: ["collected", "empty", "failed"],
    required: true
  },

  note: String,
  visitedAt: { type: Date, default: Date.now }

}, { timestamps: true });

module.exports = mongoose.model("Collection", collectionSchema);