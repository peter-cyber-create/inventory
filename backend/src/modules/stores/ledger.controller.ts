import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { ledgerService } from './ledger.service.js';

export async function list(req: AuthRequest, res: Response) {
  const { itemId, transactionType, from, to, limit } = req.query;
  const list = await ledgerService.list({
    itemId: itemId as string | undefined,
    transactionType: transactionType as string | undefined,
    from: from as string | undefined,
    to: to as string | undefined,
    limit: limit != null ? parseInt(limit as string, 10) : undefined,
  });
  res.json(list);
}

export async function getOne(req: AuthRequest, res: Response) {
  const entry = await ledgerService.getOne(req.params.id);
  res.json(entry);
}

export async function adjust(req: AuthRequest, res: Response) {
  const { itemId, quantity, reason } = req.body;
  const entry = await ledgerService.adjust(itemId, quantity, reason);
  res.status(201).json(entry);
}
