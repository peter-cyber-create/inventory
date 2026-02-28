import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { adminUsersService } from './admin.users.service.js';

export async function list(req: AuthRequest, res: Response) {
  const { departmentId, search, page, limit } = req.query;
  const result = await adminUsersService.list({
    departmentId: departmentId as string | undefined,
    search: search as string | undefined,
    page: page ? parseInt(String(page), 10) : undefined,
    limit: limit ? parseInt(String(limit), 10) : undefined,
  });
  res.json(result);
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
