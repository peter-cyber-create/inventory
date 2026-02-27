import { Router } from 'express';
import { list, getOne, create, update, remove } from './admin.departments.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { auditLog } from '../../middleware/audit.js';
import { z } from 'zod';

const router = Router();
router.use(requireAuth);

const idParam = z.object({ params: z.object({ id: z.string() }) });
const createBody = z.object({ body: z.object({ name: z.string(), code: z.string() }) });
const updateBody = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({ name: z.string().optional(), code: z.string().optional() }),
});

router.get('/', list);
router.get('/:id', validate(idParam), getOne);
router.post('/', validate(createBody), auditLog('CREATE', 'Department'), create);
router.patch('/:id', validate(updateBody), auditLog('UPDATE', 'Department'), update);
router.delete('/:id', validate(idParam), auditLog('DELETE', 'Department'), remove);

export const adminDepartmentsRoutes = router;
