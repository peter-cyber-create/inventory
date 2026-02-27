import { Router } from 'express';
import { list, getOne, create, update, remove } from './ict.servers.controller.js';
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
    ipAddress: z.string(),
    location: z.string().optional(),
    status: z.string().optional(),
    serialNumber: z.string().optional(),
    engravedNumber: z.string().optional(),
    brand: z.string().optional(),
    productNumber: z.string().optional(),
    type: z.string().optional(),
    hostServerId: z.string().optional(),
  }),
});
const updateBody = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().optional(),
    ipAddress: z.string().optional(),
    location: z.string().optional(),
    status: z.string().optional(),
    serialNumber: z.string().optional().nullable(),
    engravedNumber: z.string().optional().nullable(),
    brand: z.string().optional().nullable(),
    productNumber: z.string().optional().nullable(),
    type: z.string().optional(),
    hostServerId: z.string().optional().nullable(),
  }),
});

router.get('/', list);
router.get('/:id', validate(idParam), getOne);
router.post('/', validate(createBody), auditLog('CREATE', 'Server'), create);
router.patch('/:id', validate(updateBody), auditLog('UPDATE', 'Server'), update);
router.delete('/:id', validate(idParam), auditLog('DELETE', 'Server'), remove);

export const ictServersRoutes = router;
