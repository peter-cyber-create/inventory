import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { ictAssetsService } from './ict.assets.service.js';

export async function list(req: AuthRequest, res: Response) {
  const { status, category } = req.query;
  const list = await ictAssetsService.list({ status: status as string | undefined, category: category as string | undefined });
  res.json(list);
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
