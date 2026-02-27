import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

export const ledgerService = {
  async list(itemId?: string, transactionType?: string, limit?: number) {
    const where: { itemId?: string; transactionType?: string } = {};
    if (itemId) where.itemId = itemId;
    if (transactionType) where.transactionType = transactionType;
    const take = limit ? Math.min(limit, 500) : 200;
    return prisma.stockLedger.findMany({
      where,
      include: { item: { select: { id: true, name: true, unit: true } } },
      orderBy: { transactionDate: 'desc' },
      take,
    });
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
