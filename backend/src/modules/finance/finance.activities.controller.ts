import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { financeActivitiesService } from './finance.activities.service.js';
import XLSX from 'xlsx';

export async function list(req: AuthRequest, res: Response) {
  const { departmentId, activityType, search, page, limit } = req.query;
  const result = await financeActivitiesService.list({
    departmentId: departmentId as string | undefined,
    activityType: activityType as string | undefined,
    search: search as string | undefined,
    page: page ? parseInt(String(page), 10) : undefined,
    limit: limit ? parseInt(String(limit), 10) : undefined,
  });
  res.json(result);
}

export async function getOne(req: AuthRequest, res: Response) {
  const a = await financeActivitiesService.getOne(req.params.id);
  res.json(a);
}

export async function create(req: AuthRequest, res: Response) {
  if (!req.user?.id) return res.status(401).json({ error: 'User context required' });
  const a = await financeActivitiesService.create(req.user.id, req.body);
  res.status(201).json(a);
}

export async function update(req: AuthRequest, res: Response) {
  const a = await financeActivitiesService.update(req.params.id, req.body);
  res.json(a);
}

export async function remove(req: AuthRequest, res: Response) {
  await financeActivitiesService.remove(req.params.id);
  res.status(204).send();
}

export async function importParticipants(req: AuthRequest, res: Response) {
  const file = (req as any).file as Express.Multer.File | undefined;
  if (!file || !file.buffer) {
    return res.status(400).json({ error: 'File is required' });
  }
  const workbook = XLSX.read(file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return res.status(400).json({ error: 'No sheets found in workbook' });
  }
  const sheet = workbook.Sheets[sheetName];
  const rawRows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  const normaliseKey = (k: string) => k.trim().toLowerCase();

  const rows = rawRows.map((row, idx) => {
    const keyed: Record<string, any> = {};
    Object.keys(row || {}).forEach((key) => {
      keyed[normaliseKey(key)] = row[key];
    });
    return {
      id: idx.toString(),
      name: keyed.name ?? '',
      title: keyed.title ?? '',
      phone: keyed.phone ?? '',
      amount: keyed.amount != null ? Number(keyed.amount) || 0 : 0,
      days: keyed.days != null ? Number(keyed.days) || 0 : 0,
    };
  });

  res.json({ rows });
}
