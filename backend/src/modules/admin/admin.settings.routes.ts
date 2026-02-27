import { Router } from 'express';
import { list, getOne, getByKey, set, create, update, remove } from './admin.settings.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { auditLog } from '../../middleware/audit.js';
import { z } from 'zod';

const router = Router();
router.use(requireAuth);

const idParam = z.object({ params: z.object({ id: z.string() }) });
const keyParam = z.object({ params: z.object({ key: z.string() }) });
const setBody = z.object({
  body: z.object({ key: z.string(), value: z.string() }),
});
const createBody = z.object({
  body: z.object({ settingKey: z.string(), settingValue: z.string() }),
});
const updateBody = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({ settingValue: z.string() }),
});

router.get('/', list);
router.get('/key/:key', validate(keyParam), getByKey);
router.get('/:id', validate(idParam), getOne);
router.post('/set', validate(setBody), auditLog('SET', 'SystemSetting'), set);
router.post('/', validate(createBody), auditLog('CREATE', 'SystemSetting'), create);
router.patch('/:id', validate(updateBody), auditLog('UPDATE', 'SystemSetting'), update);
router.delete('/:id', validate(idParam), auditLog('DELETE', 'SystemSetting'), remove);

export const adminSettingsRoutes = router;
