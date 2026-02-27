import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

export const sparePartsService = {
  async list() {
    return prisma.sparePart.findMany({ orderBy: { partNumber: 'asc' } });
  },

  async getOne(id: string) {
    const s = await prisma.sparePart.findUnique({ where: { id } });
    if (!s) throw new AppError(404, 'Spare part not found');
    return s;
  },

  async create(data: {
    name: string;
    partNumber: string;
    quantity?: number;
    location?: string;
    category?: string;
    brand?: string;
    unitPrice?: number;
    unitOfMeasure?: string;
  }) {
    const ex = await prisma.sparePart.findUnique({ where: { partNumber: data.partNumber } });
    if (ex) throw new AppError(400, 'Part number already exists');
    return prisma.sparePart.create({
      data: {
        name: data.name,
        partNumber: data.partNumber,
        quantity: data.quantity ?? 0,
        location: data.location,
        category: data.category,
        brand: data.brand,
        unitPrice: data.unitPrice,
        unitOfMeasure: data.unitOfMeasure,
      },
    });
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      partNumber: string;
      quantity: number;
      location: string | null;
      category: string | null;
      brand: string | null;
      unitPrice: number;
      unitOfMeasure: string | null;
    }>,
  ) {
    if (data.partNumber) {
      const ex = await prisma.sparePart.findFirst({
        where: { partNumber: data.partNumber, NOT: { id } },
      });
      if (ex) throw new AppError(400, 'Part number already exists');
    }
    return prisma.sparePart.update({ where: { id }, data });
  },

  async remove(id: string) {
    await prisma.sparePart.delete({ where: { id } });
  },
};
