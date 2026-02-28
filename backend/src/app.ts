import "express-async-errors";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { authRoutes } from "./modules/core/auth/auth.routes.js";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes.js";
import { fleetRoutes } from "./modules/fleet/fleet.routes.js";
import { ictRoutes } from "./modules/ict/ict.routes.js";
import { storesRoutes } from "./modules/stores/stores.routes.js";
import { financeRoutes } from "./modules/finance/finance.routes.js";
import { adminRoutes } from "./modules/admin/admin.routes.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true, methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] }));
app.use(morgan("combined"));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ict", ictRoutes);
app.use("/api/fleet", fleetRoutes);
app.use("/api/stores", storesRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

export { app };
