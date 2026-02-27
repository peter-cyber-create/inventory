import { prisma } from "../../lib/prisma.js";

export const dashboardService = {
  async getOverview() {
    const [ict, vehicles, storeItems, finance, users] = await Promise.all([
      prisma.ictAsset.count(),
      prisma.vehicle.count({ where: { status: "active" } }),
      prisma.storeItem.count(),
      prisma.financeActivity.count(),
      prisma.user.count({ where: { isActive: true } }),
    ]);
    return { ict: { totalAssets: ict }, fleet: { activeVehicles: vehicles }, stores: { totalItems: storeItems }, finance: { totalActivities: finance }, admin: { activeUsers: users } };
  },
};
