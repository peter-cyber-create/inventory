import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { adminRolesService } from './admin.roles.service.js';

export async function list(_req: AuthRequest, res: Response) {
  const list = await adminRolesService.list();
  res.json(list);
}

export async function getOne(req: AuthRequest, res: Response) {
  const r = await adminRolesService.getOne(req.params.id);
  res.json(r);
}

export async function create(req: AuthRequest, res: Response) {
  const r = await adminRolesService.create(req.body);
  res.status(201).json(r);
}

export async function update(req: AuthRequest, res: Response) {
  const r = await adminRolesService.update(req.params.id, req.body);
  res.json(r);
}

export async function remove(req: AuthRequest, res: Response) {
  await adminRolesService.remove(req.params.id);
  res.status(204).send();
}
