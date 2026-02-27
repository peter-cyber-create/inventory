import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { ictMaintenanceService } from './ict.maintenance.service.js';

export async function list(req: AuthRequest, res: Response) {
  const { assetId } = req.query;
  const list = await ictMaintenanceService.list(assetId as string | undefined);
  res.json(list);
}

export async function getOne(req: AuthRequest, res: Response) {
  const m = await ictMaintenanceService.getOne(req.params.id);
  res.json(m);
}

export async function create(req: AuthRequest, res: Response) {
  const m = await ictMaintenanceService.create({
    ...req.body,
    createdById: req.user?.id,
  });
  res.status(201).json(m);
}

export async function update(req: AuthRequest, res: Response) {
  const m = await ictMaintenanceService.update(req.params.id, req.body);
  res.json(m);
}

export async function remove(req: AuthRequest, res: Response) {
  await ictMaintenanceService.remove(req.params.id);
  res.status(204).send();
}
