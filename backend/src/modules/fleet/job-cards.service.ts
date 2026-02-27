import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

export const jobCardsService = {
  async list(filters?: { status?: string; vehicleId?: string }) {
    const where: { status?: string; vehicleId?: string } = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.vehicleId) where.vehicleId = filters.vehicleId;
    return prisma.jobCard.findMany({
      where,
      include: { vehicle: true, assignedTo: { select: { id: true, name: true, email: true } } },
      orderBy: { startDate: 'desc' },
    });
  },

  async getOne(id: string) {
    const j = await prisma.jobCard.findUnique({
      where: { id },
      include: { vehicle: true, assignedTo: true },
    });
    if (!j) throw new AppError(404, 'Job card not found');
    return j;
  },

  async create(data: {
    vehicleId: string;
    issueDescription?: string;
    assignedToId?: string;
    startDate?: Date;
  }) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
    if (!vehicle) throw new AppError(404, 'Vehicle not found');
    return prisma.jobCard.create({
      data: {
        vehicleId: data.vehicleId,
        issueDescription: data.issueDescription,
        assignedToId: data.assignedToId,
        startDate: data.startDate ?? new Date(),
        status: 'open',
      },
      include: { vehicle: true, assignedTo: true },
    });
  },

  async update(id: string, data: Partial<{
    issueDescription: string;
    assignedToId: string | null;
    startDate: Date | null;
    endDate: Date | null;
    status: string;
  }>) {
    return prisma.jobCard.update({
      where: { id },
      data,
      include: { vehicle: true, assignedTo: true },
    });
  },

  async close(id: string) {
    const j = await prisma.jobCard.findUnique({ where: { id } });
    if (!j) throw new AppError(404, 'Job card not found');
    if (j.status === 'closed') throw new AppError(400, 'Already closed');
    return prisma.jobCard.update({
      where: { id },
      data: { status: 'closed', endDate: new Date() },
      include: { vehicle: true, assignedTo: true },
    });
  },

  async remove(id: string) {
    await prisma.jobCard.delete({ where: { id } });
  },
};
