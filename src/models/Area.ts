import mongoose, { Schema, Model } from "mongoose";
import { AreaDocument } from "../types";

const areaSchema = new Schema<AreaDocument>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const Area: Model<AreaDocument> = mongoose.model<AreaDocument>("Area", areaSchema);

export default Area;

