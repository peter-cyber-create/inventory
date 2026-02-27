import { Router } from 'express';
import { create, list, getOne, updateStatus, remove } from './requisitions.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { auditLog } from '../../middleware/audit.js';
import { z } from 'zod';

const router = Router();
router.use(requireAuth);

const idParam = z.object({ params: z.object({ id: z.string() }) });
const createBody = z.object({
  body: z.object({
    vehicleId: z.string(),
    description: z.string().optional(),
    projectUnit: z.string(),
    headOfDepartment: z.string(),
    serviceRequestingOfficer: z.string(),
    driverName: z.string().optional(),
    mobile: z.string().optional(),
    projectEmail: z.string().email().optional(),
    currentMileage: z.number().int().nonnegative().optional(),
    lastServiceMileage: z.number().int().nonnegative().optional(),
    requestDate: z.string(),
    details: z.unknown().optional(),
  }),
});
const statusBody = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({ status: z.string() }),
});

router.get('/', list);
router.get('/:id', validate(idParam), getOne);
router.post('/', validate(createBody), auditLog('CREATE', 'FleetRequisition'), create);
router.patch('/:id/status', validate(statusBody), auditLog('UPDATE', 'FleetRequisition'), updateStatus);
router.delete('/:id', validate(idParam), auditLog('DELETE', 'FleetRequisition'), remove);

export const requisitionsRoutes = router;
