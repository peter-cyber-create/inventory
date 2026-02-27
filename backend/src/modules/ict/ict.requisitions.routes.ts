import { Router } from 'express';
import { list, getOne, create, updateStatus, remove } from './ict.requisitions.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { auditLog } from '../../middleware/audit.js';
import { z } from 'zod';

const router = Router();
router.use(requireAuth);

const idParam = z.object({ params: z.object({ id: z.string() }) });
const createBody = z.object({
  body: z.object({
    assetType: z.string(),
    quantity: z.number().optional(),
    justification: z.string().optional(),
  }),
});
const statusBody = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({ status: z.string() }),
});

router.get('/', list);
router.get('/:id', validate(idParam), getOne);
router.post('/', validate(createBody), auditLog('CREATE', 'IctRequisition'), create);
router.patch('/:id/status', validate(statusBody), auditLog('UPDATE', 'IctRequisition'), updateStatus);
router.delete('/:id', validate(idParam), auditLog('DELETE', 'IctRequisition'), remove);

export const ictRequisitionsRoutes = router;
