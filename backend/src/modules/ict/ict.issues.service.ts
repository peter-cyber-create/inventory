import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

export const ictIssuesService = {
  async list(requisitionId?: string, assetId?: string) {
    const where: { requisitionId?: string; assetId?: string } = {};
    if (requisitionId) where.requisitionId = requisitionId;
    if (assetId) where.assetId = assetId;
    return prisma.ictIssue.findMany({
      where,
      include: {
        requisition: true,
        asset: { select: { id: true, assetTag: true, name: true } },
        issuedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { issueDate: 'desc' },
    });
  },

  async getOne(id: string) {
    const i = await prisma.ictIssue.findUnique({
      where: { id },
      include: { requisition: true, asset: true, issuedTo: true },
    });
    if (!i) throw new AppError(404, 'Issue record not found');
    return i;
  },

  async create(data: { requisitionId: string; assetId: string; issuedToId: string }) {
    const [requisition, asset, user] = await Promise.all([
      prisma.ictRequisition.findUnique({ where: { id: data.requisitionId } }),
      prisma.ictAsset.findUnique({ where: { id: data.assetId } }),
      prisma.user.findUnique({ where: { id: data.issuedToId } }),
    ]);
    if (!requisition) throw new AppError(404, 'Requisition not found');
    if (!asset) throw new AppError(404, 'ICT asset not found');
    if (!user) throw new AppError(404, 'User not found');
    if (asset.status !== 'available') throw new AppError(400, 'Asset is not available');
    const [issue] = await prisma.$transaction([
      prisma.ictIssue.create({
        data: {
          requisitionId: data.requisitionId,
          assetId: data.assetId,
          issuedToId: data.issuedToId,
        },
        include: { requisition: true, asset: true, issuedTo: true },
      }),
      prisma.ictAsset.update({
        where: { id: data.assetId },
        data: { status: 'assigned', assignedToId: data.issuedToId },
      }),
      prisma.ictRequisition.update({
        where: { id: data.requisitionId },
        data: { status: 'issued' },
      }),
    ]);
    return issue;
  },

  async remove(id: string) {
    const issue = await prisma.ictIssue.findUnique({ where: { id } });
    if (!issue) throw new AppError(404, 'Issue record not found');
    await prisma.$transaction([
      prisma.ictAsset.update({
        where: { id: issue.assetId },
        data: { status: 'available', assignedToId: null },
      }),
      prisma.ictIssue.delete({ where: { id } }),
    ]);
  },
};
