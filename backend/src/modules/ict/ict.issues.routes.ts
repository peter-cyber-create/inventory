import { Router } from 'express';
import { list, getOne, create, remove } from './ict.issues.controller.js';
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
    assetId: z.string(),
    issuedToId: z.string(),
  }),
});

router.get('/', list);
router.get('/:id', validate(idParam), getOne);
router.post('/', validate(createBody), auditLog('CREATE', 'IctIssue'), create);
router.delete('/:id', validate(idParam), auditLog('DELETE', 'IctIssue'), remove);

export const ictIssuesRoutes = router;
