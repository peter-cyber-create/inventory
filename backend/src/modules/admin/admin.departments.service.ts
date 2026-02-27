import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

export const adminDepartmentsService = {
  async list() {
    return prisma.department.findMany({
      include: { _count: { select: { users: true } } },
      orderBy: { code: 'asc' },
    });
  },

  async getOne(id: string) {
    const d = await prisma.department.findUnique({
      where: { id },
      include: { users: true },
    });
    if (!d) throw new AppError(404, 'Department not found');
    return d;
  },

  async create(data: { name: string; code: string }) {
    const ex = await prisma.department.findUnique({ where: { code: data.code } });
    if (ex) throw new AppError(400, 'Department code already exists');
    return prisma.department.create({ data });
  },

  async update(id: string, data: Partial<{ name: string; code: string }>) {
    if (data.code) {
      const ex = await prisma.department.findFirst({ where: { code: data.code, NOT: { id } } });
      if (ex) throw new AppError(400, 'Department code already exists');
    }
    return prisma.department.update({ where: { id }, data });
  },

  async remove(id: string) {
    await prisma.department.delete({ where: { id } });
  },
};
