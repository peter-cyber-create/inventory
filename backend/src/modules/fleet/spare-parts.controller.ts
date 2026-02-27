import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { sparePartsService } from './spare-parts.service.js';

export async function list(_req: AuthRequest, res: Response) {
  const list = await sparePartsService.list();
  res.json(list);
}

export async function getOne(req: AuthRequest, res: Response) {
  const s = await sparePartsService.getOne(req.params.id);
  res.json(s);
}

export async function create(req: AuthRequest, res: Response) {
  const s = await sparePartsService.create(req.body);
  res.status(201).json(s);
}

export async function update(req: AuthRequest, res: Response) {
  const s = await sparePartsService.update(req.params.id, req.body);
  res.json(s);
}

export async function remove(req: AuthRequest, res: Response) {
  await sparePartsService.remove(req.params.id);
  res.status(204).send();
}
