import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { itemsService } from './items.service.js';

export async function list(req: AuthRequest, res: Response) {
  const { category, search, page, limit } = req.query;
  const result = await itemsService.list({
    category: category as string | undefined,
    search: search as string | undefined,
    page: page ? parseInt(String(page), 10) : undefined,
    limit: limit ? parseInt(String(limit), 10) : undefined,
  });
  res.json(result);
}

export async function getOne(req: AuthRequest, res: Response) {
  const item = await itemsService.getOne(req.params.id);
  res.json(item);
}

export async function create(req: AuthRequest, res: Response) {
  const item = await itemsService.create(req.body);
  res.status(201).json(item);
}

export async function update(req: AuthRequest, res: Response) {
  const item = await itemsService.update(req.params.id, req.body);
  res.json(item);
}

export async function remove(req: AuthRequest, res: Response) {
  await itemsService.remove(req.params.id);
  res.status(204).send();
}
