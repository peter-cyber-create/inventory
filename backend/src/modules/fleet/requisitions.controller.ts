import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { requisitionsService } from './requisitions.service.js';

export async function list(req: AuthRequest, res: Response) {
  const { status } = req.query;
  const userId = req.user?.id;
  const list = await requisitionsService.list(userId, status as string | undefined);
  res.json(list);
}

export async function getOne(req: AuthRequest, res: Response) {
  const r = await requisitionsService.getOne(req.params.id);
  res.json(r);
}

export async function create(req: AuthRequest, res: Response) {
  if (!req.user?.id) return res.status(401).json({ error: 'User context required' });
  const r = await requisitionsService.create(req.user.id, req.body);
  res.status(201).json(r);
}

export async function updateStatus(req: AuthRequest, res: Response) {
  const { status } = req.body;
  const r = await requisitionsService.updateStatus(req.params.id, status);
  res.json(r);
}

export async function remove(req: AuthRequest, res: Response) {
  await requisitionsService.remove(req.params.id);
  res.status(204).send();
}
