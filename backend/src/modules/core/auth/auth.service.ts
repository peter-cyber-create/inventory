import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../../config.js";
import { AppError } from "../../../middleware/errorHandler.js";
import { prisma } from "../../../lib/prisma.js";

export const authService = {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        role: true,
        department: true,
      },
    });
    if (!user || !user.isActive) throw new AppError(401, "Invalid credentials");
    if (!user.passwordHash) throw new AppError(401, "Invalid credentials");
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError(401, "Invalid credentials");
    const permissions: string[] = [];
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role?.name, permissions },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as jwt.SignOptions,
    );
    const { passwordHash: _, ...rest } = user;
    return { token, user: rest };
  },
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { role: true, department: true } });
    if (!user) throw new AppError(404, "User not found");
    const { passwordHash: _, ...rest } = user;
    return rest;
  },
};
