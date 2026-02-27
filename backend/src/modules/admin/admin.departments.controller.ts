import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { adminDepartmentsService } from './admin.departments.service.js';

export async function list(_req: AuthRequest, res: Response) {
  const list = await adminDepartmentsService.list();
  res.json(list);
}

export async function getOne(req: AuthRequest, res: Response) {
  const d = await adminDepartmentsService.getOne(req.params.id);
  res.json(d);
}

export async function create(req: AuthRequest, res: Response) {
  const d = await adminDepartmentsService.create(req.body);
  res.status(201).json(d);
}

export async function update(req: AuthRequest, res: Response) {
  const d = await adminDepartmentsService.update(req.params.id, req.body);
  res.json(d);
}

export async function remove(req: AuthRequest, res: Response) {
  await adminDepartmentsService.remove(req.params.id);
  res.status(204).send();
}
