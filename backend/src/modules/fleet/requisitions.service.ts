import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

export const requisitionsService = {
  async list(userId?: string, status?: string) {
    const where: { requestedById?: string; status?: string } = {};
    if (userId) where.requestedById = userId;
    if (status) where.status = status;
    return prisma.fleetRequisition.findMany({
      where,
      include: { vehicle: true, requestedBy: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getOne(id: string) {
    const r = await prisma.fleetRequisition.findUnique({
      where: { id },
      include: { vehicle: true, requestedBy: true, receiving: true },
    });
    if (!r) throw new AppError(404, 'Requisition not found');
    return r;
  },

  async create(
    userId: string,
    data: {
      vehicleId?: string;
      description?: string;
      projectUnit?: string;
      headOfDepartment?: string;
      serviceRequestingOfficer?: string;
      driverName?: string;
      mobile?: string;
      projectEmail?: string;
      currentMileage?: number;
      lastServiceMileage?: number;
      requestDate?: Date;
      details?: unknown;
    },
  ) {
    return prisma.fleetRequisition.create({
      data: {
        requestedById: userId,
        vehicleId: data.vehicleId,
        description: data.description,
        projectUnit: data.projectUnit,
        headOfDepartment: data.headOfDepartment,
        serviceRequestingOfficer: data.serviceRequestingOfficer,
        driverName: data.driverName,
        mobile: data.mobile,
        projectEmail: data.projectEmail,
        currentMileage: data.currentMileage,
        lastServiceMileage: data.lastServiceMileage,
        requestDate: data.requestDate,
        details: data.details as any,
        status: 'pending',
      },
      include: { vehicle: true, requestedBy: { select: { id: true, name: true, email: true } } },
    });
  },

  async updateStatus(id: string, status: string) {
    const r = await prisma.fleetRequisition.findUnique({ where: { id } });
    if (!r) throw new AppError(404, 'Requisition not found');
    return prisma.fleetRequisition.update({
      where: { id },
      data: { status },
      include: { vehicle: true, requestedBy: true },
    });
  },

  async remove(id: string) {
    await prisma.fleetRequisition.delete({ where: { id } });
  },
};
