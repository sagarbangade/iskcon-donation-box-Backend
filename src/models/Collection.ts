import mongoose, { Schema, Model } from "mongoose";
import { CollectionDocument } from "../types";

const collectionSchema = new Schema(
  {
    boxId: { type: Schema.Types.ObjectId, ref: "Box", required: true },
    volunteerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    areaId: { type: Schema.Types.ObjectId, ref: "Area" },
    amount: Number,
    visitType: {
      type: String,
      enum: ["collected", "empty", "failed"],
      required: true,
    },
    note: String,
    visitedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Collection: Model<CollectionDocument> = mongoose.model<CollectionDocument>(
  "Collection",
  collectionSchema
);

export default Collection;

