import { Router } from 'express';
import { list, getOne } from './ledger.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { z } from 'zod';

const router = Router();
router.use(requireAuth);

const idParam = z.object({ params: z.object({ id: z.string() }) });

router.get('/', list);
router.get('/:id', validate(idParam), getOne);

export const ledgerRoutes = router;
