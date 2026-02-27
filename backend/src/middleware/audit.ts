import { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.js";

export function auditLog(_action: string, _entity: string) {
  return (_req: AuthRequest, _res: Response, next: NextFunction) => next();
}
