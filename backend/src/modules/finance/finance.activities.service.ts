import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';
import { Decimal } from '@prisma/client/runtime/library';

export const financeActivitiesService = {
  async list(filters?: { departmentId?: string; activityType?: string }) {
    const where: { departmentId?: string; activityType?: string } = {};
    if (filters?.departmentId) where.departmentId = filters.departmentId;
    if (filters?.activityType) where.activityType = filters.activityType;
    return prisma.financeActivity.findMany({
      where,
      include: {
        department: { select: { id: true, name: true, code: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getOne(id: string) {
    const a = await prisma.financeActivity.findUnique({
      where: { id },
      include: { department: true, createdBy: true },
    });
    if (!a) throw new AppError(404, 'Finance activity not found');
    return a;
  },

  async create(
    createdById: string,
    data: {
      title: string;
      description?: string;
      amount: number | Decimal;
      activityType?: string;
      departmentId?: string;
      invoiceDate?: string;
      voucherNumber?: string;
      funder?: string;
      status?: string;
      days?: number;
      participants?: {
        name: string;
        title?: string;
        phone?: string;
        amount?: number;
        days?: number;
      }[];
    },
  ) {
    return prisma.financeActivity.create({
      data: {
        title: data.title,
        description: data.description,
        amount: data.amount,
        activityType: data.activityType,
        departmentId: data.departmentId,
        invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : undefined,
        voucherNumber: data.voucherNumber,
        funder: data.funder,
        status: data.status,
        days: data.days,
        participants: data.participants as any,
        createdById,
      },
      include: {
        department: { select: { id: true, name: true, code: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async update(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      amount: number | Decimal;
      activityType: string;
      departmentId: string | null;
      invoiceDate: string;
      voucherNumber: string;
      funder: string;
      status: string;
      days: number;
      participants: {
        name: string;
        title?: string;
        phone?: string;
        amount?: number;
        days?: number;
      }[] | null;
    }>,
  ) {
    const updateData: any = { ...data };
    if (data.invoiceDate !== undefined) {
      updateData.invoiceDate = data.invoiceDate ? new Date(data.invoiceDate) : null;
    }
    return prisma.financeActivity.update({
      where: { id },
      data: updateData,
      include: { department: true, createdBy: true },
    });
  },

  async remove(id: string) {
    await prisma.financeActivity.delete({ where: { id } });
  },
};
