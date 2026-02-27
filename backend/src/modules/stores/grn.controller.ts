import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { grnService } from './grn.service.js';

export async function list(req: AuthRequest, res: Response) {
  const list = await grnService.list();
  res.json(list);
}

export async function getOne(req: AuthRequest, res: Response) {
  const grn = await grnService.getOne(req.params.id);
  res.json(grn);
}

export async function create(req: AuthRequest, res: Response) {
  const payload = { ...req.body, receivedById: req.user?.id ?? req.body.receivedById };
  const grn = await grnService.create(payload);
  res.status(201).json(grn);
}

export async function remove(req: AuthRequest, res: Response) {
  await grnService.remove(req.params.id);
  res.status(204).send();
}
