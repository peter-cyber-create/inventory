import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { ledgerService } from './ledger.service.js';

export async function list(req: AuthRequest, res: Response) {
  const { itemId, transactionType, limit } = req.query;
  const list = await ledgerService.list(
    itemId as string | undefined,
    transactionType as string | undefined,
    limit != null ? parseInt(limit as string, 10) : undefined
  );
  res.json(list);
}

export async function getOne(req: AuthRequest, res: Response) {
  const entry = await ledgerService.getOne(req.params.id);
  res.json(entry);
}
