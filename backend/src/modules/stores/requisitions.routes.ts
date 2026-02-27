import { Router } from 'express';
import { list, getOne, create, updateStatus, remove } from './requisitions.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { auditLog } from '../../middleware/audit.js';
import { z } from 'zod';

const router = Router();
router.use(requireAuth);

const idParam = z.object({ params: z.object({ id: z.string() }) });
const createBody = z.object({
  body: z.object({
    departmentId: z.string().optional(),
    serialNumber: z.string().optional(),
    country: z.string().optional(),
    ministry: z.string().optional(),
    fromDepartment: z.string().optional(),
    toStore: z.string().optional(),
    purpose: z.string().optional(),
    items: z.array(z.object({
      itemId: z.string(),
      quantityRequested: z.number().int().min(1),
    })).min(1),
  }),
});
const statusBody = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({ status: z.string() }),
});

router.get('/', list);
router.get('/:id', validate(idParam), getOne);
router.post('/', validate(createBody), auditLog('CREATE', 'StoreRequisition'), create);
router.patch('/:id/status', validate(statusBody), auditLog('UPDATE', 'StoreRequisition'), updateStatus);
router.delete('/:id', validate(idParam), auditLog('DELETE', 'StoreRequisition'), remove);

export const storeRequisitionsRoutes = router;
