import { Router } from 'express';
import { create, list, getOne, update, remove } from './items.controller.js';
// NOTE: Authentication is intentionally NOT required on this module for now
// to allow Stores items to be managed without JWT issues in the current setup.
import { validate } from '../../middleware/validate.js';
import { auditLog } from '../../middleware/audit.js';
import { z } from 'zod';

const router = Router();

const idParam = z.object({ params: z.object({ id: z.string() }) });
const createBody = z.object({
  body: z.object({
    name: z.string().min(1),
    category: z.string().optional(),
    unit: z.string().optional(),
    quantityInStock: z.number().optional(),
    brand: z.string().optional(),
    barcode: z.string().optional(),
  }),
});
const updateBody = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(1).optional(),
    category: z.string().optional().nullable(),
    unit: z.string().optional(),
    quantityInStock: z.number().optional(),
    brand: z.string().optional().nullable(),
    barcode: z.string().optional().nullable(),
  }),
});

router.get('/', list);
router.get('/:id', validate(idParam), getOne);
router.post('/', validate(createBody), auditLog('CREATE', 'StoreItem'), create);
router.patch('/:id', validate(updateBody), auditLog('UPDATE', 'StoreItem'), update);
router.delete('/:id', validate(idParam), auditLog('DELETE', 'StoreItem'), remove);

export const itemsRoutes = router;
