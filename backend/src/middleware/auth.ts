import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { AppError } from "./errorHandler.js";
import { prisma } from "../lib/prisma.js";

export interface AuthRequest extends Request {
  user?: { id: string; email: string; roleId: string | null };
}

export async function requireAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError(401, "Authentication required"));
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string; email: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, include: { role: true } });
    if (!user || !user.isActive) return next(new AppError(401, "Invalid or inactive user"));
    req.user = { id: user.id, email: user.email, roleId: user.roleId };
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
}
