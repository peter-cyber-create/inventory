import { Router } from 'express';
import { list, getOne, create, update, remove } from './ict.maintenance.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { auditLog } from '../../middleware/audit.js';
import { z } from 'zod';

const router = Router();
router.use(requireAuth);

const idParam = z.object({ params: z.object({ id: z.string() }) });
const createBody = z.object({
  body: z.object({
    assetId: z.string(),
    issueDescription: z.string().optional(),
    actionTaken: z.string().optional(),
    technician: z.string().optional(),
    maintenanceDate: z.string().optional(),
    nextServiceDate: z.string().optional(),
    cost: z.number().optional(),
  }),
});
const updateBody = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    issueDescription: z.string().optional(),
    actionTaken: z.string().optional(),
    technician: z.string().optional(),
    maintenanceDate: z.string().optional(),
    nextServiceDate: z.string().optional(),
    cost: z.number().optional(),
  }),
});

router.get('/', list);
router.get('/:id', validate(idParam), getOne);
router.post('/', validate(createBody), auditLog('CREATE', 'IctMaintenance'), create);
router.patch('/:id', validate(updateBody), auditLog('UPDATE', 'IctMaintenance'), update);
router.delete('/:id', validate(idParam), auditLog('DELETE', 'IctMaintenance'), remove);

export const ictMaintenanceRoutes = router;
