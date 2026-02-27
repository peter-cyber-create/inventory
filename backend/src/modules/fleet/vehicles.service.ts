import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

export const vehiclesService = {
  async list(status?: string) {
    const where = status ? { status } : {};
    return prisma.vehicle.findMany({
      where,
      include: { _count: { select: { jobCards: true, fleetRequisitions: true } } },
      orderBy: { registrationNumber: 'asc' },
    });
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
