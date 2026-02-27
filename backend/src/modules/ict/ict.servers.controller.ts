import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { ictServersService } from './ict.servers.service.js';

export async function list(req: AuthRequest, res: Response) {
  const { status, type } = req.query;
  const list = await ictServersService.list(
    status as string | undefined,
    type as string | undefined,
  );
  res.json(list);
}

export async function getOne(req: AuthRequest, res: Response) {
  const s = await ictServersService.getOne(req.params.id);
  res.json(s);
}

export async function create(req: AuthRequest, res: Response) {
  const s = await ictServersService.create(req.body);
  res.status(201).json(s);
}

export async function update(req: AuthRequest, res: Response) {
  const s = await ictServersService.update(req.params.id, req.body);
  res.json(s);
}

export async function remove(req: AuthRequest, res: Response) {
  await ictServersService.remove(req.params.id);
  res.status(204).send();
}
