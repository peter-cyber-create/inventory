import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export const itemsService = {
  async list(filters?: { category?: string; search?: string; page?: number; limit?: number }) {
    const where: { category?: string; OR?: { name?: { contains: string; mode: 'insensitive' }; barcode?: { contains: string; mode: 'insensitive' } }[] } = {};
    if (filters?.category) where.category = filters.category;
    if (filters?.search?.trim()) {
      const q = filters.search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { barcode: { contains: q, mode: 'insensitive' } },
      ];
    }
    const page = Math.max(1, filters?.page ?? 1);
    const limit = Math.min(MAX_LIMIT, Math.max(1, filters?.limit ?? DEFAULT_LIMIT));
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.storeItem.findMany({ where, orderBy: { name: 'asc' }, skip, take: limit }),
      prisma.storeItem.count({ where }),
    ]);
    return { data, total, page, limit };
  },

  async getOne(id: string) {
    const item = await prisma.storeItem.findUnique({ where: { id } });
    if (!item) throw new AppError(404, 'Store item not found');
    return item;
  },

  async create(data: {
    name: string;
    category?: string;
    unit?: string;
    quantityInStock?: number;
    brand?: string;
    barcode?: string;
  }) {
    return prisma.storeItem.create({
      data: {
        name: data.name,
        category: data.category,
        unit: data.unit ?? 'pcs',
        quantityInStock: data.quantityInStock ?? 0,
        brand: data.brand,
        barcode: data.barcode,
      },
    });
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      category: string;
      unit: string;
      quantityInStock: number;
      brand: string | null;
      barcode: string | null;
    }>,
  ) {
    return prisma.storeItem.update({ where: { id }, data });
  },

  async remove(id: string) {
    const [grnCount, ledgerCount] = await Promise.all([
      prisma.grnItem.count({ where: { itemId: id } }),
      prisma.stockLedger.count({ where: { itemId: id } }),
    ]);
    if (grnCount > 0 || ledgerCount > 0) {
      throw new AppError(
        400,
        'Cannot delete item: it has GRN lines or stock ledger entries. Remove or adjust those first.',
      );
    }
    await prisma.storeItem.delete({ where: { id } });
  },
};
