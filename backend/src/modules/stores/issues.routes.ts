import { Router } from 'express';
import { list, getOne, create } from './issues.controller.js';
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
    items: z.array(z.object({
      itemId: z.string(),
      quantity: z.number().min(1),
    })).optional(),
  }),
});

router.get('/', list);
router.get('/:id', validate(idParam), getOne);
router.post('/', validate(createBody), auditLog('CREATE', 'StoreIssue'), create);

export const storeIssuesRoutes = router;
