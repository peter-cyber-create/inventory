import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { adminLookupsService } from './admin.lookups.service.js';

export async function getDepartmentsAndDesignations(_req: AuthRequest, res: Response) {
  const data = await adminLookupsService.getDepartmentsAndDesignations();
  res.json(data);
}
