import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

export const itemsService = {
  async list(category?: string) {
    const where = category ? { category } : {};
    return prisma.storeItem.findMany({
      where,
      orderBy: { name: 'asc' },
    });
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
    await prisma.storeItem.delete({ where: { id } });
  },
};
