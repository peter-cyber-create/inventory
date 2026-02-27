import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';
import { Decimal } from '@prisma/client/runtime/library';

export const ictMaintenanceService = {
  async list(assetId?: string) {
    const where = assetId ? { assetId } : {};
    return prisma.ictMaintenance.findMany({
      where,
      include: { asset: { select: { id: true, assetTag: true, name: true } } },
      orderBy: { maintenanceDate: 'desc' },
    });
  },

  async getOne(id: string) {
    const m = await prisma.ictMaintenance.findUnique({
      where: { id },
      include: { asset: true },
    });
    if (!m) throw new AppError(404, 'Maintenance record not found');
    return m;
  },

  async create(data: {
    assetId: string;
    issueDescription?: string;
    actionTaken?: string;
    technician?: string;
    maintenanceDate?: Date;
    nextServiceDate?: Date;
    cost?: number;
    createdById?: string;
  }) {
    const asset = await prisma.ictAsset.findUnique({ where: { id: data.assetId } });
    if (!asset) throw new AppError(404, 'ICT asset not found');
    return prisma.ictMaintenance.create({
      data: {
        assetId: data.assetId,
        issueDescription: data.issueDescription,
        actionTaken: data.actionTaken,
        technician: data.technician,
        maintenanceDate: data.maintenanceDate ?? new Date(),
        nextServiceDate: data.nextServiceDate,
        cost: data.cost != null ? new Decimal(data.cost) : undefined,
        createdById: data.createdById,
      },
      include: { asset: { select: { id: true, assetTag: true, name: true } } },
    });
  },

  async update(id: string, data: Partial<{
    issueDescription: string;
    actionTaken: string;
    technician: string;
    maintenanceDate: Date;
    nextServiceDate: Date;
    cost: number;
  }>) {
    const updateData: any = { ...data };
    if (data.cost != null) {
      updateData.cost = new Decimal(data.cost);
    }
    return prisma.ictMaintenance.update({
      where: { id },
      data: updateData,
      include: { asset: { select: { id: true, assetTag: true, name: true } } },
    });
  },

  async remove(id: string) {
    await prisma.ictMaintenance.delete({ where: { id } });
  },
};
