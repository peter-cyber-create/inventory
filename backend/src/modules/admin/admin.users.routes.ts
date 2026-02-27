import { Router } from 'express';
import { list, getOne, create, update, remove } from './admin.users.controller.js';
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
    email: z.string().email(),
    username: z.string().optional(),
    healthEmail: z.string().email().optional(),
    phone: z.string().optional(),
    designation: z.string().optional(),
    module: z.string().optional(),
    isActive: z.boolean().optional(),
    departmentId: z.string().optional(),
    roleId: z.string().optional(),
  }),
});
const updateBody = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    username: z.string().optional().nullable(),
    healthEmail: z.string().email().optional().nullable(),
    phone: z.string().optional().nullable(),
    designation: z.string().optional().nullable(),
    module: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
    departmentId: z.string().optional().nullable(),
    roleId: z.string().optional().nullable(),
  }),
});

router.get('/', list);
router.get('/:id', validate(idParam), getOne);
router.post('/', validate(createBody), auditLog('CREATE', 'User'), create);
router.patch('/:id', validate(updateBody), auditLog('UPDATE', 'User'), update);
router.delete('/:id', validate(idParam), auditLog('DELETE', 'User'), remove);

export const adminUsersRoutes = router;
