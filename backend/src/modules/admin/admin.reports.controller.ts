import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';

export async function systemSummary(_req: AuthRequest, res: Response) {
  const [
    usersCount,
    ictAssetsCount,
    vehiclesCount,
    storeItemsCount,
    financeActivitiesCount,
    pendingRequisitionsIct,
    pendingRequisitionsStore,
    pendingRequisitionsFleet,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.ictAsset.count(),
    prisma.vehicle.count(),
    prisma.storeItem.count(),
    prisma.financeActivity.count(),
    prisma.ictRequisition.count({ where: { status: 'pending' } }),
    prisma.storeRequisition.count({ where: { status: 'pending' } }),
    prisma.fleetRequisition.count({ where: { status: 'pending' } }),
  ]);
  res.json({
    users: usersCount,
    ictAssets: ictAssetsCount,
    vehicles: vehiclesCount,
    storeItems: storeItemsCount,
    financeActivities: financeActivitiesCount,
    pendingRequisitions: {
      ict: pendingRequisitionsIct,
      stores: pendingRequisitionsStore,
      fleet: pendingRequisitionsFleet,
    },
  });
}
