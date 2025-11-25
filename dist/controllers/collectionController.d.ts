import { Response } from "express";
import { AuthRequest } from "../types";
export declare const addCollection: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllCollections: (_req: AuthRequest, res: Response) => Promise<void>;
export declare const getCollectionsByBox: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateCollection: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteCollection: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=collectionController.d.ts.map