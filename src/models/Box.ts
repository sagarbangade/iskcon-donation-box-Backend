import mongoose, { Schema, Model } from "mongoose";
import { BoxDocument } from "../types";

const boxSchema = new Schema<BoxDocument>(
  {
    locationName: { type: String, required: true },
    caretakerName: String,
    caretakerPhone: String,
    locationLink: String,
    areaId: { type: Schema.Types.ObjectId, ref: "Area" },
    assignedVolunteerId: { type: Schema.Types.ObjectId, ref: "User" },
    lastCollectionAt: Date,
    nextCollectionAt: Date,
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

const Box: Model<BoxDocument> = mongoose.model<BoxDocument>("Box", boxSchema);

export default Box;

