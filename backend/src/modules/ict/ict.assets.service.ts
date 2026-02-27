import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

export const ictAssetsService = {
  async list(filters?: { status?: string; category?: string }) {
    const where: { status?: string; category?: string } = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.category) where.category = filters.category;
    return prisma.ictAsset.findMany({
      where,
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
      orderBy: { assetTag: 'asc' },
    });
  },

  async getOne(id: string) {
    const a = await prisma.ictAsset.findUnique({
      where: { id },
      include: { assignedTo: true, maintenance: true, issues: true },
    });
    if (!a) throw new AppError(404, 'ICT asset not found');
    return a;
  },

  async create(data: {
    assetTag: string;
    name: string;
    category: string;
    serialNumber?: string;
    status?: string;
    location?: string;
    assignedToId?: string;
    purchaseDate?: Date;
  }) {
    const ex = await prisma.ictAsset.findUnique({ where: { assetTag: data.assetTag } });
    if (ex) throw new AppError(400, 'Asset tag already exists');
    return prisma.ictAsset.create({
      data: {
        assetTag: data.assetTag,
        name: data.name,
        category: data.category,
        serialNumber: data.serialNumber,
        status: data.status ?? 'available',
        location: data.location,
        assignedToId: data.assignedToId,
        purchaseDate: data.purchaseDate,
      },
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });
  },

  async update(id: string, data: Partial<{
    assetTag: string;
    name: string;
    category: string;
    serialNumber: string;
    status: string;
    location: string;
    assignedToId: string | null;
    purchaseDate: Date | null;
  }>) {
    if (data.assetTag) {
      const ex = await prisma.ictAsset.findFirst({ where: { assetTag: data.assetTag, NOT: { id } } });
      if (ex) throw new AppError(400, 'Asset tag already exists');
    }
    return prisma.ictAsset.update({
      where: { id },
      data,
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });
  },

  async remove(id: string) {
    await prisma.ictAsset.delete({ where: { id } });
  },
};
