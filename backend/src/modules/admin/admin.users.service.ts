import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

export const adminUsersService = {
  async list(departmentId?: string) {
    const where = departmentId ? { departmentId } : {};
    return prisma.user.findMany({
      where,
      include: { department: { select: { id: true, name: true, code: true } }, role: true },
      orderBy: { name: 'asc' },
    });
  },

  async getOne(id: string) {
    const u = await prisma.user.findUnique({
      where: { id },
      include: { department: true, role: true },
    });
    if (!u) throw new AppError(404, 'User not found');
    return u;
  },

  async create(data: {
    name: string;
    email: string;
    username?: string;
    healthEmail?: string;
    phone?: string;
    designation?: string;
    module?: string;
    isActive?: boolean;
    departmentId?: string;
    roleId?: string;
  }) {
    const ex = await prisma.user.findUnique({ where: { email: data.email } });
    if (ex) throw new AppError(400, 'Email already exists');
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        username: data.username,
        healthEmail: data.healthEmail,
        phone: data.phone,
        designation: data.designation,
        module: data.module,
        isActive: data.isActive ?? true,
        departmentId: data.departmentId,
        roleId: data.roleId,
      },
      include: { department: true, role: true },
    });
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      username: string | null;
      healthEmail: string | null;
      phone: string | null;
      designation: string | null;
      module: string | null;
      isActive: boolean;
      departmentId: string | null;
      roleId: string | null;
    }>,
  ) {
    if (data.email) {
      const ex = await prisma.user.findFirst({ where: { email: data.email, NOT: { id } } });
      if (ex) throw new AppError(400, 'Email already exists');
    }
    return prisma.user.update({
      where: { id },
      data,
      include: { department: true, role: true },
    });
  },

  async remove(id: string) {
    await prisma.user.delete({ where: { id } });
  },
};
