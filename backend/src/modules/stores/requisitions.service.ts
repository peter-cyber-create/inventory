import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

export const storeRequisitionsService = {
  async list(requesterId?: string, status?: string, departmentId?: string) {
    const where: { requesterId?: string; status?: string; departmentId?: string } = {};
    if (requesterId) where.requesterId = requesterId;
    if (status) where.status = status;
    if (departmentId) where.departmentId = departmentId;
    return prisma.storeRequisition.findMany({
      where,
      include: {
        requester: { select: { id: true, name: true, email: true } },
        department: { select: { id: true, name: true, code: true } },
        issues: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getOne(id: string) {
    const r = await prisma.storeRequisition.findUnique({
      where: { id },
      include: {
        requester: true,
        department: true,
        issues: true,
      },
    });
    if (!r) throw new AppError(404, 'Store requisition not found');
    return r;
  },

  async create(
    requesterId: string,
    data: {
      departmentId?: string;
      serialNumber?: string;
      country?: string;
      ministry?: string;
      fromDepartment?: string;
      toStore?: string;
      purpose?: string;
      items: { itemId: string; quantityRequested: number }[];
    },
  ) {
    if (!data.items || data.items.length === 0) {
      throw new AppError(400, 'Requisition must contain at least one item');
    }

    const result = await prisma.$transaction(async (tx) => {
      const header = await tx.storeRequisition.create({
        data: {
          requesterId,
          departmentId: data.departmentId,
          status: 'PENDING',
          serialNumber: data.serialNumber,
          country: data.country,
          ministry: data.ministry,
          fromDepartment: data.fromDepartment,
          toStore: data.toStore,
          purpose: data.purpose,
        },
      });
      return tx.storeRequisition.findUnique({
        where: { id: header.id },
        include: {
          requester: { select: { id: true, name: true, email: true } },
          department: { select: { id: true, name: true, code: true } },
        },
      });
    });
    return result!;
  },

  async updateStatus(id: string, status: string) {
    const r = await prisma.storeRequisition.findUnique({ where: { id } });
    if (!r) throw new AppError(404, 'Store requisition not found');
    return prisma.storeRequisition.update({
      where: { id },
      data: { status: status.toUpperCase() },
      include: { requester: true, department: true },
    });
  },

  async remove(id: string) {
    await prisma.storeRequisition.delete({ where: { id } });
  },
};
