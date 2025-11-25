import { Response } from "express";
import { AuthRequest } from "../types";
export declare const createBox: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllBoxes: (_req: AuthRequest, res: Response) => Promise<void>;
export declare const getBoxById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getBoxesByVolunteer: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateBox: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteBox: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=boxController.d.ts.map