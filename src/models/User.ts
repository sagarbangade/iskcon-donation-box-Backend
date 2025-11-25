import mongoose, { Schema, Model } from "mongoose";
import { UserDocument } from "../types";

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    phone: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "volunteer"], default: "volunteer" },
    areaId: { type: Schema.Types.ObjectId, ref: "Area" },
  },
  { timestamps: true }
);

const User: Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema);

export default User;

