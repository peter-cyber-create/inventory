import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { AppError } from "./errorHandler.js";
import { prisma } from "../lib/prisma.js";

export interface AuthUser {
  id: string;
  email: string;
  roleId: string | null;
  module: string | null;
  roleName: string | null;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export async function requireAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError(401, "Authentication required"));
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string; email: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true },
    });
    if (!user || !user.isActive) return next(new AppError(401, "Invalid or inactive user"));
    req.user = {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      module: user.module ?? null,
      roleName: user.role?.name ?? null,
    };
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
}

/**
 * Require that the authenticated user belongs to one of the allowed modules.
 * If user.module is empty or set to a generic value like "All" / "All modules",
 * access is allowed to all modules.
 */
export function requireModule(modules: string | string[]) {
  const allowed = Array.isArray(modules) ? modules : [modules];
  const normalizedAllowed = allowed.map((m) => m.trim().toLowerCase());

  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, "Authentication required"));
    }
    const raw = req.user.module ?? "";
    const userModule = raw.trim();
    const lower = userModule.toLowerCase();
    if (!userModule || lower === "all" || lower === "all modules") {
      return next();
    }
    if (!normalizedAllowed.includes(lower)) {
      return next(new AppError(403, "You do not have access to this module"));
    }
    return next();
  };
}
