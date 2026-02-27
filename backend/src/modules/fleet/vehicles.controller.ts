import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { vehiclesService } from './vehicles.service.js';

export async function list(req: AuthRequest, res: Response) {
  const { status } = req.query;
  const list = await vehiclesService.list(status as string | undefined);
  res.json(list);
}

export async function getOne(req: AuthRequest, res: Response) {
  const v = await vehiclesService.getOne(req.params.id);
  res.json(v);
}

export async function create(req: AuthRequest, res: Response) {
  const v = await vehiclesService.create(req.body);
  res.status(201).json(v);
}

export async function update(req: AuthRequest, res: Response) {
  const v = await vehiclesService.update(req.params.id, req.body);
  res.json(v);
}

export async function remove(req: AuthRequest, res: Response) {
  await vehiclesService.remove(req.params.id);
  res.status(204).send();
}
