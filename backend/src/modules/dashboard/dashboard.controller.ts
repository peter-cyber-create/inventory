import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import { dashboardService } from "./dashboard.service.js";

export async function getOverview(_req: AuthRequest, res: Response) {
  const data = await dashboardService.getOverview();
  res.json(data);
}
