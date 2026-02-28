import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

function omitPassword<T extends { passwordHash?: string | null }>(u: T): Omit<T, 'passwordHash'> {
  const { passwordHash: _, ...rest } = u;
  return rest;
}

export const adminUsersService = {
  async list(filters?: { departmentId?: string; search?: string; page?: number; limit?: number }) {
    const where: { departmentId?: string; OR?: { name?: { contains: string; mode: 'insensitive' }; email?: { contains: string; mode: 'insensitive' } }[] } = {};
    if (filters?.departmentId) where.departmentId = filters.departmentId;
    if (filters?.search?.trim()) {
      const q = filters.search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ];
    }
    const page = Math.max(1, filters?.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters?.limit ?? 20));
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: { department: { select: { id: true, name: true, code: true } }, role: true },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);
    return { data: users.map(omitPassword), total, page, limit };
  },

  async getOne(id: string) {
    const u = await prisma.user.findUnique({
      where: { id },
      include: { department: true, role: true },
    });
    if (!u) throw new AppError(404, 'User not found');
    return omitPassword(u);
  },

  async create(data: {
    name: string;
    email: string;
    password?: string;
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
    if (data.username?.trim()) {
      const un = await prisma.user.findFirst({ where: { username: { equals: data.username.trim(), mode: 'insensitive' } } });
      if (un) throw new AppError(400, 'Username already in use');
    }
    const passwordHash = data.password
      ? await bcrypt.hash(data.password, 10)
      : undefined;
    const user = await prisma.user.create({
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
        passwordHash,
      },
      include: { department: true, role: true },
    });
    return omitPassword(user);
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      password: string;
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
    if (data.username !== undefined && data.username !== null && String(data.username).trim() !== '') {
      const un = await prisma.user.findFirst({
        where: {
          username: { equals: data.username!.trim(), mode: 'insensitive' },
          NOT: { id },
        },
      });
      if (un) throw new AppError(400, 'Username already in use');
    }
    const { password, ...rest } = data;
    const updateData: Parameters<typeof prisma.user.update>[0]['data'] = { ...rest };
    if (password !== undefined) {
      updateData.passwordHash = password ? await bcrypt.hash(password, 10) : null;
    }
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      include: { department: true, role: true },
    });
    return omitPassword(user);
  },

  async remove(id: string) {
    await prisma.user.delete({ where: { id } });
  },
};
