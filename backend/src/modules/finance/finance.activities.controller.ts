import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { financeActivitiesService } from './finance.activities.service.js';

export async function list(req: AuthRequest, res: Response) {
  const { departmentId, activityType } = req.query;
  const list = await financeActivitiesService.list({
    departmentId: departmentId as string | undefined,
    activityType: activityType as string | undefined,
  });
  res.json(list);
}

export async function getOne(req: AuthRequest, res: Response) {
  const a = await financeActivitiesService.getOne(req.params.id);
  res.json(a);
}

export async function create(req: AuthRequest, res: Response) {
  if (!req.user?.id) return res.status(401).json({ error: 'User context required' });
  const a = await financeActivitiesService.create(req.user.id, req.body);
  res.status(201).json(a);
}

export async function update(req: AuthRequest, res: Response) {
  const a = await financeActivitiesService.update(req.params.id, req.body);
  res.json(a);
}

export async function remove(req: AuthRequest, res: Response) {
  await financeActivitiesService.remove(req.params.id);
  res.status(204).send();
}
