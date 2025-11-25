import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
declare const authOptional: (req: AuthRequest, _res: Response, next: NextFunction) => void;
export default authOptional;
//# sourceMappingURL=authOptional.d.ts.map