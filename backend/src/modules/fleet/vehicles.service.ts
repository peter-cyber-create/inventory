import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export const vehiclesService = {
  async list(filters?: { status?: string; search?: string; page?: number; limit?: number }) {
    const where: { status?: string; OR?: { registrationNumber?: { contains: string; mode: 'insensitive' }; make?: { contains: string; mode: 'insensitive' }; model?: { contains: string; mode: 'insensitive' } }[] } = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.search?.trim()) {
      const q = filters.search.trim();
      where.OR = [
        { registrationNumber: { contains: q, mode: 'insensitive' } },
        { make: { contains: q, mode: 'insensitive' } },
        { model: { contains: q, mode: 'insensitive' } },
      ];
    }
    const page = Math.max(1, filters?.page ?? 1);
    const limit = Math.min(MAX_LIMIT, Math.max(1, filters?.limit ?? DEFAULT_LIMIT));
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: { _count: { select: { jobCards: true, fleetRequisitions: true } } },
        orderBy: { registrationNumber: 'asc' },
        skip,
        take: limit,
      }),
      prisma.vehicle.count({ where }),
    ]);
    return { data, total, page, limit };
  },

  async getOne(id: string) {
    const v = await prisma.vehicle.findUnique({
      where: { id },
      include: { jobCards: true, fleetRequisitions: true },
    });
    if (!v) throw new AppError(404, 'Vehicle not found');
    return v;
  },

  async create(data: {
    registrationNumber: string;
    make: string;
    model: string;
    year?: number;
    status?: string;
    assignedDriver?: string;
  }) {
    const ex = await prisma.vehicle.findUnique({ where: { registrationNumber: data.registrationNumber } });
    if (ex) throw new AppError(400, 'Registration number already exists');
    return prisma.vehicle.create({
      data: {
        registrationNumber: data.registrationNumber,
        make: data.make,
        model: data.model,
        year: data.year,
        status: data.status ?? 'active',
        assignedDriver: data.assignedDriver,
        oldNumberPlate: (data as any).oldNumberPlate,
        newNumberPlate: (data as any).newNumberPlate,
        type: (data as any).type,
        chassisNumber: (data as any).chassisNumber,
        engineNumber: (data as any).engineNumber,
        fuel: (data as any).fuel,
        power: (data as any).power,
        totalCost: (data as any).totalCost,
        countryOfOrigin: (data as any).countryOfOrigin,
        color: (data as any).color,
        userDepartment: (data as any).userDepartment,
        officer: (data as any).officer,
        contact: (data as any).contact,
      },
    });
  },

  async update(id: string, data: Partial<{
    registrationNumber: string;
    make: string;
    model: string;
    year: number;
    status: string;
    assignedDriver: string | null;
    oldNumberPlate: string | null;
    newNumberPlate: string | null;
    type: string;
    chassisNumber: string | null;
    engineNumber: string | null;
    fuel: string | null;
    power: number | null;
    totalCost: any;
    countryOfOrigin: string | null;
    color: string | null;
    userDepartment: string | null;
    officer: string | null;
    contact: string | null;
  }>) {
    if (data.registrationNumber) {
      const ex = await prisma.vehicle.findFirst({
        where: { registrationNumber: data.registrationNumber, NOT: { id } },
      });
      if (ex) throw new AppError(400, 'Registration number already exists');
    }
    return prisma.vehicle.update({ where: { id }, data });
  },

  async remove(id: string) {
    await prisma.vehicle.delete({ where: { id } });
  },
};
