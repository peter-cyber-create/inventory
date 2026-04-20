import { prisma } from '../../lib/prisma.js';

/**
 * Unique departments (from Department table + Staff free text) and designations (from User + Staff)
 * for dropdowns and filters — no repetition.
 */
export const adminLookupsService = {
  async getDepartmentsAndDesignations(): Promise<{
    departments: { id: string; name: string; code: string }[];
    /** Unique department names from Staff (free text) for ICT/other forms */
    departmentNames: string[];
    designations: string[];
  }> {
    const [depts, users, staff] = await Promise.all([
      prisma.department.findMany({
        select: { id: true, name: true, code: true },
        orderBy: { name: 'asc' },
      }),
      prisma.user.findMany({
        select: { designation: true },
        where: { designation: { not: null } },
      }),
      prisma.staff.findMany({
        select: { title: true, department: true },
      }),
    ]);

    const designationsSet = new Set<string>();
    users.forEach((u) => {
      const d = (u.designation ?? '').trim();
      if (d) designationsSet.add(d);
    });
    staff.forEach((s) => {
      const t = (s.title ?? '').trim();
      if (t) designationsSet.add(t);
    });
    const designations = Array.from(designationsSet).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    const departmentNamesSet = new Set<string>(depts.map((d) => d.name));
    staff.forEach((s) => {
      const d = (s.department ?? '').trim();
      if (d) departmentNamesSet.add(d);
    });
    const departmentNames = Array.from(departmentNamesSet).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    return {
      departments: depts,
      departmentNames,
      designations,
    };
  },
};
