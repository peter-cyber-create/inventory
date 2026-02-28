import { Router } from 'express';
import { list, getOne, create, remove } from './grn.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { auditLog } from '../../middleware/audit.js';
import { z } from 'zod';

const router = Router();
router.use(requireAuth);

const idParam = z.object({ params: z.object({ id: z.string() }) });
const createBody = z.object({
  body: z.object({
    supplier: z.string().optional(),
    contractNo: z.string().optional(),
    lpoNo: z.string().optional(),
    deliveryNoteNo: z.string().optional(),
    taxInvoiceNo: z.string().optional(),
    grnNo: z.string().optional(),
    supplierContact: z.string().optional(),
    remarks: z.string().optional(),
    receivedById: z.string().optional(),
    receivedDate: z.string().optional(),
    items: z.array(z.object({
      itemId: z.string(),
      quantity: z.number().min(1),
      unitPrice: z.number().optional(),
    })).min(1),
  }),
});

router.get('/', list);
router.get('/:id', validate(idParam), getOne);
router.post('/', validate(createBody), auditLog('CREATE', 'GRN'), create);
router.delete('/:id', validate(idParam), auditLog('DELETE', 'GRN'), remove);

export const grnRoutes = router;
