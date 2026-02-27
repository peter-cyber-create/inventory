import { Router } from 'express';
import { create, list, getOne, update, close } from './job-cards.controller.js';
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
    issueDescription: z.string().optional(),
    assignedToId: z.string().optional(),
    startDate: z.string().optional(),
  }),
});
const updateBody = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    issueDescription: z.string().optional(),
    assignedToId: z.string().optional().nullable(),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    status: z.string().optional(),
  }),
});

router.get('/', list);
router.get('/:id', validate(idParam), getOne);
router.post('/', validate(createBody), auditLog('CREATE', 'JobCard'), create);
router.patch('/:id', validate(updateBody), auditLog('UPDATE', 'JobCard'), update);
router.post('/:id/close', validate(idParam), auditLog('UPDATE', 'JobCard'), close);

export const jobCardsRoutes = router;
