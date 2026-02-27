import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { storeIssuesService } from './issues.service.js';

export async function list(req: AuthRequest, res: Response) {
  const { requisitionId } = req.query;
  const list = await storeIssuesService.list(requisitionId as string | undefined);
  res.json(list);
}

export async function getOne(req: AuthRequest, res: Response) {
  const i = await storeIssuesService.getOne(req.params.id);
  res.json(i);
}

export async function create(req: AuthRequest, res: Response) {
  if (!req.user?.id) return res.status(401).json({ error: 'User context required' });
  const i = await storeIssuesService.create(req.user.id, req.body);
  res.status(201).json(i);
}
