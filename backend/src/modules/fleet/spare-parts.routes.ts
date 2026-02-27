import { Router } from 'express';
import { create, list, getOne, update, remove } from './spare-parts.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { auditLog } from '../../middleware/audit.js';
import { z } from 'zod';

const router = Router();
router.use(requireAuth);

const idParam = z.object({ params: z.object({ id: z.string() }) });
const createBody = z.object({
  body: z.object({
    name: z.string(),
    partNumber: z.string(),
    quantity: z.number().optional(),
    location: z.string().optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    unitPrice: z.number().optional(),
    unitOfMeasure: z.string().optional(),
  }),
});
const updateBody = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().optional(),
    partNumber: z.string().optional(),
    quantity: z.number().optional(),
    location: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    brand: z.string().optional().nullable(),
    unitPrice: z.number().optional(),
    unitOfMeasure: z.string().optional().nullable(),
  }),
});

router.get('/', list);
router.get('/:id', validate(idParam), getOne);
router.post('/', validate(createBody), auditLog('CREATE', 'SparePart'), create);
router.patch('/:id', validate(updateBody), auditLog('UPDATE', 'SparePart'), update);
router.delete('/:id', validate(idParam), auditLog('DELETE', 'SparePart'), remove);

export const sparePartsRoutes = router;
