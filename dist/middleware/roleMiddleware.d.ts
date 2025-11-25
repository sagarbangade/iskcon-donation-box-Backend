import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
declare const roleMiddleware: (roles: ("admin" | "volunteer")[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
export default roleMiddleware;
//# sourceMappingURL=roleMiddleware.d.ts.map