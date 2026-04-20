import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { ictStaffService } from './ict.staff.service.js';
import XLSX from 'xlsx';

export async function listStaff(req: AuthRequest, res: Response) {
  const rows = await ictStaffService.list();
  res.json(rows);
}

export async function downloadStaffTemplate(req: AuthRequest, res: Response) {
  const header = ['Name', 'Job Title', 'Department', 'Division', 'Email', 'Phone'];
  const ws = XLSX.utils.aoa_to_sheet([header]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Staff');
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.setHeader('Content-Disposition', 'attachment; filename="ict_staff_template.xlsx"');
  res.send(buffer);
}

export async function importStaffFromExcel(req: AuthRequest, res: Response) {
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
      title: keyed['job title'] ?? keyed.title ?? '',
      department: keyed.department ?? '',
      division: keyed.division ?? '',
      email: keyed.email ?? '',
      phone: keyed.phone ?? '',
    };
  });

  res.json({ rows });
}

export async function saveImportedStaff(req: AuthRequest, res: Response) {
  const { rows } = req.body as {
    rows: {
      name: string;
      title?: string;
      department?: string;
      division?: string;
      email?: string;
      phone?: string;
    }[];
  };
  const created = await ictStaffService.bulkImport({ rows });
  res.status(201).json(created);
}

