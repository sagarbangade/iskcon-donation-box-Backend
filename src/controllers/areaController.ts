import { Response } from "express";
import { AuthRequest } from "../types";
import Area from "../models/Area";
import mongoose from "mongoose";

export const createArea = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    // Required field validation
    if (!name) {
      res.status(400).json({ message: "Area name is required" });
      return;
    }

    // Check for duplicate name
    const existingArea = await Area.findOne({ name });
    if (existingArea) {
      res.status(400).json({ message: "Area with this name already exists" });
      return;
    }

    const area = await Area.create({ name });
    res.json(area);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message: errorMessage });
  }
};

export const getAreas = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const areas = await Area.find();
    res.json(areas);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message: errorMessage });
  }
};

export const updateArea = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid area ID format" });
      return;
    }

    // Required field validation
    if (!name) {
      res.status(400).json({ message: "Area name is required" });
      return;
    }

    // Existence check
    const area = await Area.findById(id);
    if (!area) {
      res.status(404).json({ message: "Area not found" });
      return;
    }

    // Check for duplicate name (excluding current area)
    const existingArea = await Area.findOne({ name, _id: { $ne: id } });
    if (existingArea) {
      res.status(400).json({ message: "Area with this name already exists" });
      return;
    }

    const updatedArea = await Area.findByIdAndUpdate(id, { name }, { new: true });
    res.json(updatedArea);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message: errorMessage });
  }
};

export const deleteArea = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid area ID format" });
      return;
    }

    // Existence check
    const area = await Area.findById(id);
    if (!area) {
      res.status(404).json({ message: "Area not found" });
      return;
    }

    // Soft delete - add a deleted flag or remove from active list
    // For now, we'll actually delete it, but you can add a status field if needed
    await Area.findByIdAndDelete(id);

    res.json({ message: "Area deleted successfully" });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message: errorMessage });
  }
};

