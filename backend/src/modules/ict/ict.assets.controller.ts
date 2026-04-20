import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { ictAssetsService } from './ict.assets.service.js';
import XLSX from 'xlsx';

export async function list(req: AuthRequest, res: Response) {
  const { status, category, search, page, limit } = req.query;
  const result = await ictAssetsService.list({
    status: status as string | undefined,
    category: category as string | undefined,
    search: search as string | undefined,
    page: page ? parseInt(String(page), 10) : undefined,
    limit: limit ? parseInt(String(limit), 10) : undefined,
  });
  res.json(result);
}

export async function getOne(req: AuthRequest, res: Response) {
  const a = await ictAssetsService.getOne(req.params.id);
  res.json(a);
}

export async function create(req: AuthRequest, res: Response) {
  const a = await ictAssetsService.create(req.body);
  res.status(201).json(a);
}

export async function update(req: AuthRequest, res: Response) {
  const a = await ictAssetsService.update(req.params.id, req.body);
  res.json(a);
}

export async function remove(req: AuthRequest, res: Response) {
  await ictAssetsService.remove(req.params.id);
  res.status(204).send();
}

export async function bulkCreate(req: AuthRequest, res: Response) {
  const { rows } = req.body as {
    rows: {
      asset: string;
      model: string;
      serialNo?: string;
      engravedNo?: string;
      funding?: string;
      category: string;
    }[];
  };
  const created = await ictAssetsService.bulkCreate({
    rows,
  });
  res.status(201).json(created);
}

export async function createPerAssetRequisition(req: AuthRequest, res: Response) {
  const { serialNo, model, requestedBy, comments, assetId } = req.body as {
    serialNo?: string;
    model?: string;
    requestedBy: string;
    comments?: string;
    assetId: string;
  };
  const rec = await ictAssetsService.createPerAssetRequisition({
    assetId,
    serialNo,
    model,
    requestedBy,
    comments,
  });
  res.status(201).json(rec);
}

export async function createDirectIssue(req: AuthRequest, res: Response) {
  const { serialNo, model, issuedBy, issuedTo, department, title, assetId } = req.body as {
    serialNo?: string;
    model?: string;
    issuedBy: string;
    issuedTo: string;
    department?: string;
    title?: string;
    assetId: string;
  };
  const issue = await ictAssetsService.createDirectIssue({
    assetId,
    serialNo,
    model,
    issuedBy,
    issuedTo,
    department,
    title,
  });
  res.status(201).json(issue);
}

export async function assignStaff(req: AuthRequest, res: Response) {
  const { assetId, staffId } = req.body as { assetId: string; staffId: string };
  const asset = await ictAssetsService.assignStaff({ assetId, staffId });
  res.json(asset);
}

export async function transferOwnership(req: AuthRequest, res: Response) {
  const {
    user,
    department,
    title,
    officeNo,
    reason,
    assetId,
    previousUser,
    previousDept,
    previousTitle,
  } = req.body as {
    user: string;
    department: string;
    title?: string;
    officeNo?: string;
    reason?: string;
    assetId: string;
    previousUser?: string | null;
    previousDept?: string | null;
    previousTitle?: string | null;
  };
  const transfer = await ictAssetsService.transferOwnership({
    assetId,
    user,
    department,
    title,
    officeNo,
    reason,
    previousUser,
    previousDept,
    previousTitle,
  });
  res.status(201).json(transfer);
}

export async function disposeAsset(req: AuthRequest, res: Response) {
  const { disposalDate, disposalMethod, disposalReason, disposalCost, disposedBy, assetId } =
    req.body as {
      disposalDate: string;
      disposalMethod: string;
      disposalReason?: string;
      disposalCost?: number;
      disposedBy: string;
      assetId: string;
    };
  const disposal = await ictAssetsService.disposeAsset({
    assetId,
    disposalDate: disposalDate ? new Date(disposalDate) : new Date(),
    disposalMethod,
    disposalReason,
    disposalCost,
    disposedBy,
  });
  res.status(201).json(disposal);
}

export async function returnAsset(req: AuthRequest, res: Response) {
  const { assetId, returnedBy, reason } = req.body as {
    assetId: string;
    returnedBy: string;
    reason?: string;
  };

  const ret = await ictAssetsService.returnAsset({
    assetId,
    returnedBy,
    reason,
  });

  res.status(201).json(ret);
}

export async function downloadBulkTemplate(req: AuthRequest, res: Response) {
  const header = ['ICT Device', 'Category', 'Model', 'Serial No', 'Engraved No', 'Funding'];
  const ws = XLSX.utils.aoa_to_sheet([header]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'ICT Assets');
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.setHeader('Content-Disposition', 'attachment; filename="ict_assets_template.xlsx"');
  res.send(buffer);
}

export async function importBulkFromExcel(req: AuthRequest, res: Response) {
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
      asset: keyed['ict device'] ?? keyed['asset'] ?? '',
      category: keyed.category ?? '',
      model: keyed.model ?? '',
      serialNo: keyed['serial no'] ?? keyed['serial number'] ?? '',
      engravedNo: keyed['engraved no'] ?? keyed['engraved number'] ?? '',
      funding: keyed.funding ?? '',
    };
  });

  res.json({ rows });
}
