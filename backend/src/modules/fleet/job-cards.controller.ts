import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { jobCardsService } from './job-cards.service.js';

export async function list(req: AuthRequest, res: Response) {
  const { status, vehicleId } = req.query;
  const list = await jobCardsService.list({ status: status as string | undefined, vehicleId: vehicleId as string | undefined });
  res.json(list);
}

export async function getOne(req: AuthRequest, res: Response) {
  const j = await jobCardsService.getOne(req.params.id);
  res.json(j);
}

export async function create(req: AuthRequest, res: Response) {
  const j = await jobCardsService.create(req.body);
  res.status(201).json(j);
}

export async function update(req: AuthRequest, res: Response) {
  const j = await jobCardsService.update(req.params.id, req.body);
  res.json(j);
}

export async function close(req: AuthRequest, res: Response) {
  const j = await jobCardsService.close(req.params.id);
  res.json(j);
}
