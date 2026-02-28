import { Router } from 'express';
import { list, getOne, adjust } from './ledger.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { auditLog } from '../../middleware/audit.js';
import { z } from 'zod';

const router = Router();
router.use(requireAuth);

const idParam = z.object({ params: z.object({ id: z.string() }) });
const adjustBody = z.object({
  body: z.object({
    itemId: z.string(),
    quantity: z.number().int(),
    reason: z.string().optional(),
  }),
});

router.get('/', list);
router.get('/:id', validate(idParam), getOne);
router.post('/adjust', validate(adjustBody), auditLog('CREATE', 'StockLedger'), adjust);

export const ledgerRoutes = router;
