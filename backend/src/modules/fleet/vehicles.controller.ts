import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { vehiclesService } from './vehicles.service.js';

export async function list(req: AuthRequest, res: Response) {
  const { status, search, page, limit } = req.query;
  const result = await vehiclesService.list({
    status: status as string | undefined,
    search: search as string | undefined,
    page: page ? parseInt(String(page), 10) : undefined,
    limit: limit ? parseInt(String(limit), 10) : undefined,
  });
  res.json(result);
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
