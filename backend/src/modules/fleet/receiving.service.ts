import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

export const receivingService = {
  async list(requisitionId?: string) {
    const where = requisitionId ? { requisitionId } : {};
    return prisma.receivingRecord.findMany({
      where,
      include: { requisition: { include: { vehicle: true, requestedBy: true } }, receivedBy: true },
      orderBy: { receivedDate: 'desc' },
    });
  },

  async getOne(id: string) {
    const r = await prisma.receivingRecord.findUnique({
      where: { id },
      include: { requisition: true, receivedBy: true },
    });
    if (!r) throw new AppError(404, 'Receiving record not found');
    return r;
  },

  async create(
    receivedById: string,
    data: {
      requisitionId: string;
      transportOfficer?: string;
      oldNumberPlates?: string;
      newNumberPlates?: string;
      driverName?: string;
      mileage?: number;
      checklist?: Record<string, boolean>;
      remarks?: string;
      userSignature?: string;
      acceptedBy?: string;
    },
  ) {
    const req = await prisma.fleetRequisition.findUnique({ where: { id: data.requisitionId } });
    if (!req) throw new AppError(404, 'Fleet requisition not found');
    const [record] = await prisma.$transaction([
      prisma.receivingRecord.create({
        data: {
          requisitionId: data.requisitionId,
          receivedById,
          vehicleId: req.vehicleId ?? null,
          transportOfficer: data.transportOfficer,
          oldNumberPlates: data.oldNumberPlates,
          newNumberPlates: data.newNumberPlates,
          driverName: data.driverName,
          mileage: data.mileage,
          checklist: data.checklist as any,
          remarks: data.remarks,
          userSignature: data.userSignature,
          acceptedBy: data.acceptedBy,
        },
        include: { requisition: { include: { vehicle: true, requestedBy: true } }, receivedBy: true },
      }),
      prisma.fleetRequisition.update({
        where: { id: data.requisitionId },
        data: { status: 'received' },
      }),
    ]);
    return record;
  },

  async remove(id: string) {
    await prisma.receivingRecord.delete({ where: { id } });
  },
};
