import { Router } from 'express';
import { list, getOne, create, update, remove } from './ict.assets.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { auditLog } from '../../middleware/audit.js';
import { z } from 'zod';

const router = Router();
router.use(requireAuth);

const idParam = z.object({ params: z.object({ id: z.string() }) });
const createBody = z.object({
  body: z.object({
    assetTag: z.string(),
    name: z.string(),
    category: z.string(),
    serialNumber: z.string().optional(),
    status: z.string().optional(),
    location: z.string().optional(),
    assignedToId: z.string().optional(),
    purchaseDate: z.string().optional(),
  }),
});
const updateBody = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    assetTag: z.string().optional(),
    name: z.string().optional(),
    category: z.string().optional(),
    serialNumber: z.string().optional().nullable(),
    status: z.string().optional(),
    location: z.string().optional().nullable(),
    assignedToId: z.string().optional().nullable(),
    purchaseDate: z.string().optional().nullable(),
  }),
});

router.get('/', list);
router.get('/:id', validate(idParam), getOne);
router.post('/', validate(createBody), auditLog('CREATE', 'IctAsset'), create);
router.patch('/:id', validate(updateBody), auditLog('UPDATE', 'IctAsset'), update);
router.delete('/:id', validate(idParam), auditLog('DELETE', 'IctAsset'), remove);

export const ictAssetsRoutes = router;
