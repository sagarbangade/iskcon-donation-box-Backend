import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types";

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    res.status(500).json({ message: "JWT_SECRET is not configured" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string; role: string };
    req.user = { id: decoded.id, role: decoded.role as "admin" | "volunteer" };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;

