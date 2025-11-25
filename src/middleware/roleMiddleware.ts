import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";

const roleMiddleware = (roles: ("admin" | "volunteer")[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: "Access denied. Not enough permissions." });
      return;
    }

    next();
  };
};

export default roleMiddleware;

