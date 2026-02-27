import { Response } from "express";
import { AuthRequest } from "../../../middleware/auth.js";
import { authService } from "./auth.service.js";

export async function login(req: AuthRequest, res: Response) {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.json(result);
}

export async function me(req: AuthRequest, res: Response) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  const user = await authService.getProfile(req.user.id);
  res.json(user);
}
