import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { adminUsersService } from './admin.users.service.js';

export async function list(req: AuthRequest, res: Response) {
  const { departmentId } = req.query;
  const list = await adminUsersService.list(departmentId as string | undefined);
  res.json(list);
}

export async function getOne(req: AuthRequest, res: Response) {
  const u = await adminUsersService.getOne(req.params.id);
  res.json(u);
}

export async function create(req: AuthRequest, res: Response) {
  const u = await adminUsersService.create(req.body);
  res.status(201).json(u);
}

export async function update(req: AuthRequest, res: Response) {
  const u = await adminUsersService.update(req.params.id, req.body);
  res.json(u);
}

export async function remove(req: AuthRequest, res: Response) {
  await adminUsersService.remove(req.params.id);
  res.status(204).send();
}
