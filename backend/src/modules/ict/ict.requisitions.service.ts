import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

export const ictRequisitionsService = {
  async list(requesterId?: string, status?: string) {
    const where: { requesterId?: string; status?: string } = {};
    if (requesterId) where.requesterId = requesterId;
    if (status) where.status = status;
    return prisma.ictRequisition.findMany({
      where,
      include: { requester: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getOne(id: string) {
    const r = await prisma.ictRequisition.findUnique({
      where: { id },
      include: { requester: true, issues: { include: { asset: true, issuedTo: true } } },
    });
    if (!r) throw new AppError(404, 'Requisition not found');
    return r;
  },

  async create(requesterId: string, data: {
    assetType: string;
    quantity?: number;
    justification?: string;
  }) {
    return prisma.ictRequisition.create({
      data: {
        requesterId,
        assetType: data.assetType,
        quantity: data.quantity ?? 1,
        justification: data.justification,
        status: 'pending',
      },
      include: { requester: { select: { id: true, name: true, email: true } } },
    });
  },

  async updateStatus(id: string, status: string) {
    const r = await prisma.ictRequisition.findUnique({ where: { id } });
    if (!r) throw new AppError(404, 'Requisition not found');
    return prisma.ictRequisition.update({
      where: { id },
      data: { status },
      include: { requester: true },
    });
  },

  async remove(id: string) {
    await prisma.ictRequisition.delete({ where: { id } });
  },
};
