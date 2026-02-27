import { Router } from 'express';
import { create, list, getOne, remove } from './receiving.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { auditLog } from '../../middleware/audit.js';
import { z } from 'zod';

const router = Router();
router.use(requireAuth);

const idParam = z.object({ params: z.object({ id: z.string() }) });
const createBody = z.object({
  body: z.object({
    requisitionId: z.string(),
    transportOfficer: z.string().optional(),
    oldNumberPlates: z.string().optional(),
    newNumberPlates: z.string().optional(),
    driverName: z.string().optional(),
    mileage: z.number().int().nonnegative().optional(),
    checklist: z.record(z.boolean()).optional(),
    remarks: z.string().optional(),
    userSignature: z.string().optional(),
    acceptedBy: z.string().optional(),
  }),
});

router.get('/', list);
router.get('/:id', validate(idParam), getOne);
router.post('/', validate(createBody), auditLog('CREATE', 'ReceivingRecord'), create);
router.delete('/:id', validate(idParam), auditLog('DELETE', 'ReceivingRecord'), remove);

export const receivingRoutes = router;
