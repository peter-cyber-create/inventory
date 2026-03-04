import { Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { AuthRequest } from '../../middleware/auth.js';

type ParticipantRow = {
  name: string;
  title?: string;
  phone?: string;
  days?: number;
  amount?: number;
};

type ActivityWithParticipants = {
  id: string;
  title: string;
  departmentId: string | null;
  invoiceDate: Date | null;
  voucherNumber: string | null;
  funder: string | null;
  status: string | null;
  participants: ParticipantRow[] | null;
  department?: { id: string; name: string | null } | null;
};

async function getActivitiesWithParticipants(where: any = {}): Promise<ActivityWithParticipants[]> {
  const activities = await prisma.financeActivity.findMany({
    where,
    orderBy: { invoiceDate: 'desc' },
    include: {
      department: { select: { id: true, name: true } },
    },
  });
  return activities.map((a) => ({
    id: a.id,
    title: a.title,
    departmentId: a.departmentId,
    invoiceDate: a.invoiceDate,
    voucherNumber: a.voucherNumber,
    funder: a.funder,
    status: a.status,
    participants: (a.participants as ParticipantRow[] | null) ?? null,
    department: a.department as any,
  }));
}

export async function activitiesByDate(req: AuthRequest, res: Response) {
  const { startDate, endDate } = req.query;
  const where: any = {};
  if (startDate || endDate) {
    where.invoiceDate = {};
    if (startDate) where.invoiceDate.gte = new Date(String(startDate));
    if (endDate) where.invoiceDate.lte = new Date(String(endDate));
  }
  const data = await getActivitiesWithParticipants(where);
  res.json({ data });
}

export async function activitiesByFunding(req: AuthRequest, res: Response) {
  const { funder } = req.query;
  const where: any = {};
  if (funder && String(funder).trim()) {
    where.funder = String(funder).trim();
  }
  const data = await getActivitiesWithParticipants(where);
  res.json({ data });
}

export async function activitiesPerPerson(req: AuthRequest, res: Response) {
  const { name } = req.query;
  const activities = await getActivitiesWithParticipants();
  const rows: any[] = [];
  activities.forEach((a) => {
    (a.participants ?? []).forEach((p, idx) => {
      rows.push({
        id: `${a.id}:${idx}`,
        name: p.name,
        title: p.title,
        phone: p.phone,
        activityName: a.title,
        days: p.days ?? null,
        amount: p.amount ?? null,
      });
    });
  });
  const q = String(name || '').trim().toLowerCase();
  const filtered = q
    ? rows.filter((r) => (r.name || '').toLowerCase().includes(q))
    : rows;
  res.json({ data: filtered });
}

export async function pendingAccountability(req: AuthRequest, res: Response) {
  // Assumption: "pending accountability" = activities marked as completed but not yet accounted
  // Here we treat all completed activities as pending; adjust when an explicit field is available.
  const activities = await getActivitiesWithParticipants({
    status: 'completed',
  });
  const data = activities.map((a) => ({
    id: a.id,
    activityName: a.title,
    dept: a.department?.name ?? null,
    invoiceDate: a.invoiceDate,
    amt: (a.participants ?? []).reduce((sum, p) => sum + (p.amount ?? 0), 0),
  }));
  res.json({ data });
}

function aggregateByUser(activities: ActivityWithParticipants[]) {
  const map = new Map<
    string,
    { name: string; title?: string; phone?: string; totalDays: number; totalAmount: number }
  >();
  activities.forEach((a) => {
    (a.participants ?? []).forEach((p) => {
      if (!p.name && !p.phone) return;
      const key = `${p.phone || ''}|${p.name || ''}`.toLowerCase();
      const current = map.get(key) ?? {
        name: p.name || '',
        title: p.title,
        phone: p.phone,
        totalDays: 0,
        totalAmount: 0,
      };
      current.totalDays += p.days ?? 0;
      current.totalAmount += p.amount ?? 0;
      map.set(key, current);
    });
  });
  return Array.from(map.values());
}

export async function flaggedUsers(req: AuthRequest, res: Response) {
  const activities = await getActivitiesWithParticipants();
  const aggregated = aggregateByUser(activities);
  // Flag rule: total days >= 150
  const data = aggregated.filter((u) => u.totalDays >= 150);
  res.json({ data });
}

export async function activityPerParticipant(req: AuthRequest, res: Response) {
  const activities = await getActivitiesWithParticipants();
  const rows: any[] = [];
  activities.forEach((a) => {
    (a.participants ?? []).forEach((p, idx) => {
      rows.push({
        id: `${a.id}:${idx}`,
        name: p.name,
        title: p.title,
        phone: p.phone,
        activity: a.title,
        days: p.days ?? null,
        amount: p.amount ?? null,
        invoiceDate: a.invoiceDate,
        vocherno: a.voucherNumber,
        funder: a.funder,
      });
    });
  });
  res.json({ data: rows });
}

export async function usersAmounts(req: AuthRequest, res: Response) {
  const activities = await getActivitiesWithParticipants();
  const aggregated = aggregateByUser(activities);
  res.json({
    data: aggregated.map((u) => ({
      name: u.name,
      title: u.title,
      phone: u.phone,
      totalDays: u.totalDays,
      totalAmounts: u.totalAmount,
    })),
  });
}

function toCsv(rows: Record<string, any>[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(
      headers
        .map((h) => {
          const v = row[h];
          if (v == null) return '';
          const s = String(v).replace(/"/g, '""');
          return `"${s}"`;
        })
        .join(','),
    );
  }
  return lines.join('\n');
}

export async function exportFlaggedUsersExcel(req: AuthRequest, res: Response) {
  const activities = await getActivitiesWithParticipants();
  const aggregated = aggregateByUser(activities).filter((u) => u.totalDays >= 150);
  const rows = aggregated.map((u) => ({
    Name: u.name,
    Title: u.title ?? '',
    Phone: u.phone ?? '',
    TotalDays: u.totalDays,
    TotalAmount: u.totalAmount,
  }));
  const csv = toCsv(rows);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="flagged-users.csv"');
  res.send(csv);
}

export async function exportActivityPerParticipantExcel(req: AuthRequest, res: Response) {
  const activities = await getActivitiesWithParticipants();
  const rows: any[] = [];
  activities.forEach((a) => {
    (a.participants ?? []).forEach((p) => {
      rows.push({
        Name: p.name,
        Title: p.title ?? '',
        Phone: p.phone ?? '',
        Activity: a.title,
        Days: p.days ?? 0,
        Amount: p.amount ?? 0,
        InvoiceDate: a.invoiceDate ? a.invoiceDate.toISOString().slice(0, 10) : '',
        VoucherNo: a.voucherNumber ?? '',
        Funder: a.funder ?? '',
      });
    });
  });
  const csv = toCsv(rows);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="activity-per-participant.csv"');
  res.send(csv);
}

export async function exportUsersAmountsExcel(req: AuthRequest, res: Response) {
  const activities = await getActivitiesWithParticipants();
  const aggregated = aggregateByUser(activities);
  const rows = aggregated.map((u) => ({
    Name: u.name,
    Title: u.title ?? '',
    Phone: u.phone ?? '',
    TotalDays: u.totalDays,
    TotalAmounts: u.totalAmount,
  }));
  const csv = toCsv(rows);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="users-amounts.csv"');
  res.send(csv);
}

