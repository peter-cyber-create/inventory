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
    const maintDate = data.maintenanceDate ?? new Date();
    const nextDate = data.nextServiceDate;
    if (nextDate && new Date(nextDate) < new Date(maintDate)) {
      throw new AppError(400, 'Next service date must be on or after maintenance date');
    }
    return prisma.ictMaintenance.create({
      data: {
        assetId: data.assetId,
        issueDescription: data.issueDescription,
        actionTaken: data.actionTaken,
        technician: data.technician,
        maintenanceDate: maintDate,
        nextServiceDate: nextDate,
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
    maintenanceDate: Date | string;
    nextServiceDate: Date | string | null;
    cost: number;
  }>) {
    const existing = await prisma.ictMaintenance.findUnique({ where: { id } });
    if (!existing) throw new AppError(404, 'Maintenance record not found');
    const maintDate = data.maintenanceDate ? new Date(data.maintenanceDate) : existing.maintenanceDate;
    const nextDate = data.nextServiceDate !== undefined
      ? (data.nextServiceDate ? new Date(data.nextServiceDate) : null)
      : existing.nextServiceDate;
    if (nextDate && maintDate && nextDate < maintDate) {
      throw new AppError(400, 'Next service date must be on or after maintenance date');
    }
    const updatePayload: Parameters<typeof prisma.ictMaintenance.update>[0]['data'] = {};
    if (data.issueDescription !== undefined) updatePayload.issueDescription = data.issueDescription;
    if (data.actionTaken !== undefined) updatePayload.actionTaken = data.actionTaken;
    if (data.technician !== undefined) updatePayload.technician = data.technician;
    if (data.maintenanceDate !== undefined) updatePayload.maintenanceDate = maintDate;
    if (data.nextServiceDate !== undefined) updatePayload.nextServiceDate = nextDate;
    if (data.cost != null) updatePayload.cost = new Decimal(data.cost);
    return prisma.ictMaintenance.update({
      where: { id },
      data: updatePayload,
      include: { asset: { select: { id: true, assetTag: true, name: true } } },
    });
  },

  async remove(id: string) {
    await prisma.ictMaintenance.delete({ where: { id } });
  },
};
