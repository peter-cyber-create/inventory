import { prisma } from '../../lib/prisma.js';

export const ictStaffService = {
  async list() {
    return prisma.staff.findMany({
      orderBy: { name: 'asc' },
    });
  },

  async bulkImport(data: {
    rows: {
      name: string;
      title?: string;
      department?: string;
      division?: string;
      email?: string;
      phone?: string;
    }[];
  }) {
    if (!data.rows.length) return [];
    const created = await prisma.$transaction(async (tx) => {
      const out = [];
      for (let i = 0; i < data.rows.length; i += 1) {
        const row = data.rows[i];
        if (!row.name.trim()) continue;
        const s = await tx.staff.create({
          data: {
            name: row.name.trim(),
            title: row.title?.trim() || undefined,
            department: row.department?.trim() || undefined,
            division: row.division?.trim() || undefined,
            email: row.email?.trim() || undefined,
            phone: row.phone?.trim() || undefined,
          },
        });
        out.push(s);
      }
      return out;
    });
    return created;
  },
};

