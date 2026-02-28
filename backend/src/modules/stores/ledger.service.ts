import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

export const ledgerService = {
  async list(filters?: { itemId?: string; transactionType?: string; from?: string; to?: string; limit?: number }) {
    const where: { itemId?: string; transactionType?: string; transactionDate?: { gte?: Date; lte?: Date } } = {};
    if (filters?.itemId) where.itemId = filters.itemId;
    if (filters?.transactionType) where.transactionType = filters.transactionType;
    if (filters?.from || filters?.to) {
      where.transactionDate = {};
      if (filters.from) where.transactionDate.gte = new Date(filters.from);
      if (filters.to) where.transactionDate.lte = new Date(filters.to);
    }
    const take = filters?.limit ? Math.min(filters.limit, 500) : 200;
    return prisma.stockLedger.findMany({
      where,
      include: { item: { select: { id: true, name: true, unit: true } } },
      orderBy: { transactionDate: 'desc' },
      take,
    });
  },

  async adjust(itemId: string, quantity: number, _reason?: string) {
    const item = await prisma.storeItem.findUnique({ where: { id: itemId } });
    if (!item) throw new AppError(404, 'Store item not found');
    const newBalance = Math.max(0, item.quantityInStock + quantity);
    const delta = newBalance - item.quantityInStock;
    const [entry] = await prisma.$transaction([
      prisma.stockLedger.create({
        data: {
          itemId,
          transactionType: 'ADJUST',
          quantity: delta,
          balanceAfter: newBalance,
        },
        include: { item: { select: { id: true, name: true, unit: true } } },
      }),
      prisma.storeItem.update({
        where: { id: itemId },
        data: { quantityInStock: newBalance },
      }),
    ]);
    return entry;
  },

  async getOne(id: string) {
    const entry = await prisma.stockLedger.findUnique({
      where: { id },
      include: { item: true },
    });
    if (!entry) throw new AppError(404, 'Ledger entry not found');
    return entry;
  },
};
