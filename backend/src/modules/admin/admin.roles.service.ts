import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

export const adminRolesService = {
  async list() {
    return prisma.role.findMany({
      include: { _count: { select: { users: true } } },
      orderBy: { name: 'asc' },
    });
  },

  async getOne(id: string) {
    const r = await prisma.role.findUnique({
      where: { id },
      include: { users: true },
    });
    if (!r) throw new AppError(404, 'Role not found');
    return r;
  },

  async create(data: { name: string }) {
    const ex = await prisma.role.findUnique({ where: { name: data.name } });
    if (ex) throw new AppError(400, 'Role name already exists');
    return prisma.role.create({ data: { name: data.name } });
  },

  async update(id: string, data: { name: string }) {
    const ex = await prisma.role.findFirst({ where: { name: data.name, NOT: { id } } });
    if (ex) throw new AppError(400, 'Role name already exists');
    return prisma.role.update({ where: { id }, data });
  },

  async remove(id: string) {
    await prisma.role.delete({ where: { id } });
  },
};
