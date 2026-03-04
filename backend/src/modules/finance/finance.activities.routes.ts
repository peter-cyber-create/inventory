import { Router } from 'express';
import { list, getOne, create, update, remove, importParticipants } from './finance.activities.controller.js';
import { requireAuth, requireModule } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { auditLog } from '../../middleware/audit.js';
import { z } from 'zod';
import multer from 'multer';

const router = Router();
router.use(requireAuth, requireModule('Finance'));
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const idParam = z.object({ params: z.object({ id: z.string() }) });
const createBody = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    amount: z.number().positive('Amount must be greater than 0'),
    activityType: z.string().optional(),
    departmentId: z.string().optional(),
    invoiceDate: z.string().optional(),
    voucherNumber: z.string().optional(),
    funder: z.string().optional(),
    status: z.string().optional(),
    days: z.number().int().optional(),
    participants: z
      .array(
        z.object({
          name: z.string(),
          title: z.string().optional(),
          phone: z.string().optional(),
          amount: z.number().optional(),
          days: z.number().int().optional(),
        }),
      )
      .optional(),
  }),
});
const updateBody = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    amount: z.number().positive('Amount must be greater than 0').optional(),
    activityType: z.string().optional(),
    departmentId: z.string().optional().nullable(),
    invoiceDate: z.string().optional(),
    voucherNumber: z.string().optional(),
    funder: z.string().optional(),
    status: z.string().optional(),
    days: z.number().int().optional(),
    participants: z
      .array(
        z.object({
          name: z.string(),
          title: z.string().optional(),
          phone: z.string().optional(),
          amount: z.number().optional(),
          days: z.number().int().optional(),
        }),
      )
      .optional()
      .nullable(),
  }),
});

router.get('/', list);
router.get('/:id', validate(idParam), getOne);
router.post('/', validate(createBody), auditLog('CREATE', 'FinanceActivity'), create);
router.patch('/:id', validate(updateBody), auditLog('UPDATE', 'FinanceActivity'), update);
router.delete('/:id', validate(idParam), auditLog('DELETE', 'FinanceActivity'), remove);
router.post('/participants/import', upload.single('file'), importParticipants);

export const financeActivitiesRoutes = router;
