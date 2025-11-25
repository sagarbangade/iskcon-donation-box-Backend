import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types";

const authOptional = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;

  if (!header) {
    req.user = null;
    next();
    return;
  }

  const token = header.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    req.user = null;
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string; role: string };
    req.user = { id: decoded.id, role: decoded.role as "admin" | "volunteer" };
  } catch (err) {
    req.user = null;
  }

  next();
};

export default authOptional;

