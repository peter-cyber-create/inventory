import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

export const storeIssuesService = {
  async list(requisitionId?: string) {
    const where = requisitionId ? { requisitionId } : {};
    return prisma.storeIssue.findMany({
      where,
      include: {
        requisition: { include: { requester: true, department: true } },
        issuedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { issueDate: 'desc' },
    });
  },

  async getOne(id: string) {
    const i = await prisma.storeIssue.findUnique({
      where: { id },
      include: { requisition: true, issuedBy: true },
    });
    if (!i) throw new AppError(404, 'Store issue not found');
    return i;
  },

  async create(issuedById: string, data: {
    requisitionId: string;
    items?: { itemId: string; quantity: number }[];
  }) {
    const req = await prisma.storeRequisition.findUnique({
      where: { id: data.requisitionId },
    });
    if (!req) throw new AppError(404, 'Store requisition not found');
    if (req.status === 'issued') throw new AppError(400, 'Requisition already issued');

    const issue = await prisma.$transaction(async (tx) => {
      const issueRecord = await tx.storeIssue.create({
        data: { requisitionId: data.requisitionId, issuedById },
        include: { requisition: true, issuedBy: true },
      });
      if (data.items && data.items.length > 0) {
        for (const line of data.items) {
          const item = await tx.storeItem.findUnique({ where: { id: line.itemId } });
          if (!item) throw new AppError(400, `Item not found: ${line.itemId}`);
          if (item.quantityInStock < line.quantity) {
            throw new AppError(400, `Insufficient stock for ${item.name}. Available: ${item.quantityInStock}`);
          }
          const newBalance = item.quantityInStock - line.quantity;
          await tx.storeItem.update({
            where: { id: line.itemId },
            data: { quantityInStock: newBalance },
          });
          await tx.stockLedger.create({
            data: {
              itemId: line.itemId,
              transactionType: 'OUT',
              quantity: -line.quantity,
              balanceAfter: newBalance,
            },
          });
        }
      }
      await tx.storeRequisition.update({
        where: { id: data.requisitionId },
        data: { status: 'ISSUED' },
      });
      return tx.storeIssue.findUnique({
        where: { id: issueRecord.id },
        include: { requisition: true, issuedBy: true },
      });
    });
    return issue!;
  },
};
