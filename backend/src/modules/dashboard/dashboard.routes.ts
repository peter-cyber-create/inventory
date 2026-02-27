import { Router } from "express";
import { getOverview } from "./dashboard.controller.js";
import { requireAuth } from "../../middleware/auth.js";

const router = Router();
router.use(requireAuth);
router.get("/", getOverview);
export const dashboardRoutes = router;
