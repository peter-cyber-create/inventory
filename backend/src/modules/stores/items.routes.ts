import { Router } from 'express';
import { create, list, getOne, update, remove } from './items.controller.js';
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
    sku: z.string().optional(),
    category: z.string().optional(),
    unit: z.string().optional(),
    quantityInStock: z.number().optional(),
    brand: z.string().optional(),
    barcode: z.string().optional(),
    isAssetSource: z.boolean().optional(),
  }),
});
const updateBody = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().optional(),
    sku: z.string().optional().nullable(),
    category: z.string().optional(),
    unit: z.string().optional(),
    quantityInStock: z.number().optional(),
    brand: z.string().optional().nullable(),
    barcode: z.string().optional().nullable(),
    isAssetSource: z.boolean().optional(),
  }),
});

router.get('/', list);
router.get('/:id', validate(idParam), getOne);
router.post('/', validate(createBody), auditLog('CREATE', 'StoreItem'), create);
router.patch('/:id', validate(updateBody), auditLog('UPDATE', 'StoreItem'), update);
router.delete('/:id', validate(idParam), auditLog('DELETE', 'StoreItem'), remove);

export const itemsRoutes = router;
