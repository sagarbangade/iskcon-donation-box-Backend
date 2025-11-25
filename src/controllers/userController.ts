import { Response } from "express";
import { AuthRequest } from "../types";
import User from "../models/User";
import Area from "../models/Area";
import mongoose from "mongoose";

export const getAllUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("areaId", "name");

    res.json(users);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message: errorMessage });
  }
};

export const getVolunteers = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const volunteers = await User.find({ role: "volunteer" })
      .select("-password")
      .populate("areaId", "name");

    res.json(volunteers);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message: errorMessage });
  }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID format" });
      return;
    }

    const user = await User.findById(id)
      .select("-password")
      .populate("areaId", "name");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message: errorMessage });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, areaId } = req.body;

    // ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID format" });
      return;
    }

    // ObjectId validation for areaId if provided
    if (areaId && !mongoose.Types.ObjectId.isValid(areaId)) {
      res.status(400).json({ message: "Invalid areaId format" });
      return;
    }

    // Existence check
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        res.status(400).json({ message: "Email already exists" });
        return;
      }
    }

    // Verify area exists if areaId provided
    if (areaId) {
      const area = await Area.findById(areaId);
      if (!area) {
        res.status(404).json({ message: "Area not found" });
        return;
      }
    }

    // Update user (exclude password from update)
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (role) updateData.role = role;
    if (areaId !== undefined) updateData.areaId = areaId;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true })
      .select("-password")
      .populate("areaId", "name");

    res.json(updatedUser);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message: errorMessage });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID format" });
      return;
    }

    // Existence check
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Prevent deleting the last admin
    if (user.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount === 1) {
        res.status(400).json({ message: "Cannot delete the last admin" });
        return;
      }
    }

    // Soft delete - mark user as inactive (we'll add a status field or just delete)
    // For MVP, we'll actually delete the user
    await User.findByIdAndDelete(id);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message: errorMessage });
  }
};

