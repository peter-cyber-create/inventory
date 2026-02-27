import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

export const ictServersService = {
  async list(status?: string, type?: string) {
    const where: { status?: string; type?: string } = {};
    if (status) where.status = status;
    if (type) where.type = type;
    return prisma.server.findMany({ where, orderBy: { name: 'asc' } });
  },

  async getOne(id: string) {
    const s = await prisma.server.findUnique({ where: { id } });
    if (!s) throw new AppError(404, 'Server not found');
    return s;
  },

  async create(data: {
    name: string;
    ipAddress: string;
    location?: string;
    status?: string;
    serialNumber?: string;
    engravedNumber?: string;
    brand?: string;
    productNumber?: string;
    type?: string;
    hostServerId?: string;
  }) {
    return prisma.server.create({
      data: {
        name: data.name,
        ipAddress: data.ipAddress,
        location: data.location,
        status: data.status ?? 'active',
        serialNumber: data.serialNumber,
        engravedNumber: data.engravedNumber,
        brand: data.brand,
        productNumber: data.productNumber,
        type: data.type ?? 'physical',
        hostServerId: data.hostServerId,
      },
    });
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      ipAddress: string;
      location: string;
      status: string;
      serialNumber: string | null;
      engravedNumber: string | null;
      brand: string | null;
      productNumber: string | null;
      type: string;
      hostServerId: string | null;
    }>,
  ) {
    return prisma.server.update({ where: { id }, data });
  },

  async remove(id: string) {
    await prisma.server.delete({ where: { id } });
  },
};
