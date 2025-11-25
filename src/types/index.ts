import { Request } from "express";
import { Document, Types } from "mongoose";

export interface JwtPayload {
  id: string;
  role: "admin" | "volunteer";
}

export interface AuthRequest extends Request {
  user?: JwtPayload | null;
}

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  phone?: string;
  email: string;
  password: string;
  role: "admin" | "volunteer";
  areaId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface AreaDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BoxDocument extends Document {
  _id: Types.ObjectId;
  locationName: string;
  caretakerName?: string;
  caretakerPhone?: string;
  locationLink?: string;
  areaId?: Types.ObjectId;
  assignedVolunteerId?: Types.ObjectId;
  lastCollectionAt?: Date;
  nextCollectionAt?: Date;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

export interface CollectionDocument extends Document {
  _id: Types.ObjectId;
  boxId: Types.ObjectId;
  volunteerId: Types.ObjectId;
  areaId?: Types.ObjectId;
  amount?: number;
  visitType: "collected" | "empty" | "failed";
  note?: string;
  visitedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

