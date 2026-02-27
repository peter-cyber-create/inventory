import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { adminSettingsService } from './admin.settings.service.js';

export async function list(_req: AuthRequest, res: Response) {
  const list = await adminSettingsService.list();
  res.json(list);
}

export async function getOne(req: AuthRequest, res: Response) {
  const s = await adminSettingsService.getOne(req.params.id);
  res.json(s);
}

export async function getByKey(req: AuthRequest, res: Response) {
  const s = await adminSettingsService.getByKey(req.params.key);
  res.json(s);
}

export async function set(req: AuthRequest, res: Response) {
  const { key, value } = req.body;
  const s = await adminSettingsService.set(key, value);
  res.json(s);
}

export async function create(req: AuthRequest, res: Response) {
  const s = await adminSettingsService.create(req.body);
  res.status(201).json(s);
}

export async function update(req: AuthRequest, res: Response) {
  const s = await adminSettingsService.update(req.params.id, req.body);
  res.json(s);
}

export async function remove(req: AuthRequest, res: Response) {
  await adminSettingsService.remove(req.params.id);
  res.status(204).send();
}
