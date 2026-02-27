import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { receivingService } from './receiving.service.js';

export async function list(req: AuthRequest, res: Response) {
  const { requisitionId } = req.query;
  const list = await receivingService.list(requisitionId as string | undefined);
  res.json(list);
}

export async function getOne(req: AuthRequest, res: Response) {
  const r = await receivingService.getOne(req.params.id);
  res.json(r);
}

export async function create(req: AuthRequest, res: Response) {
  if (!req.user?.id) return res.status(401).json({ error: 'User context required' });
  const r = await receivingService.create(req.user.id, req.body);
  res.status(201).json(r);
}

export async function remove(req: AuthRequest, res: Response) {
  await receivingService.remove(req.params.id);
  res.status(204).send();
}
