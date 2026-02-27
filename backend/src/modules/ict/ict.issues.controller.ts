import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { ictIssuesService } from './ict.issues.service.js';

export async function list(req: AuthRequest, res: Response) {
  const { requisitionId, assetId } = req.query;
  const list = await ictIssuesService.list(
    requisitionId as string | undefined,
    assetId as string | undefined
  );
  res.json(list);
}

export async function getOne(req: AuthRequest, res: Response) {
  const i = await ictIssuesService.getOne(req.params.id);
  res.json(i);
}

export async function create(req: AuthRequest, res: Response) {
  const i = await ictIssuesService.create(req.body);
  res.status(201).json(i);
}

export async function remove(req: AuthRequest, res: Response) {
  await ictIssuesService.remove(req.params.id);
  res.status(204).send();
}
