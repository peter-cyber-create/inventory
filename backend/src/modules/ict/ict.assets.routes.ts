import { Router } from 'express';
import {
  list,
  getOne,
  create,
  update,
  remove,
  bulkCreate,
  createPerAssetRequisition,
  createDirectIssue,
  assignStaff,
  transferOwnership,
  disposeAsset,
  returnAsset,
  downloadBulkTemplate,
  importBulkFromExcel,
} from './ict.assets.controller.js';
import { requireAuth, requireModule } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { auditLog } from '../../middleware/audit.js';
import { z } from 'zod';
import multer from 'multer';

const router = Router();
router.use(requireAuth, requireModule('ICT'));
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

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

const bulkBody = z.object({
  body: z.object({
    rows: z
      .array(
        z.object({
          asset: z.string(),
          model: z.string(),
          serialNo: z.string().optional(),
          engravedNo: z.string().optional(),
          funding: z.string().optional(),
          category: z.string(),
        }),
      )
      .min(1),
  }),
});

const perAssetReqBody = z.object({
  body: z.object({
    serialNo: z.string().optional(),
    model: z.string().optional(),
    requestedBy: z.string(),
    comments: z.string().optional(),
    assetId: z.string(),
  }),
});

const directIssueBody = z.object({
  body: z.object({
    serialNo: z.string().optional(),
    model: z.string().optional(),
    issuedBy: z.string(),
    issuedTo: z.string(),
    department: z.string().optional(),
    title: z.string().optional(),
    assetId: z.string(),
  }),
});

const assignStaffBody = z.object({
  body: z.object({
    assetId: z.string(),
    staffId: z.string(),
  }),
});

const transferBody = z.object({
  body: z.object({
    user: z.string(),
    department: z.string(),
    title: z.string().optional(),
    officeNo: z.string().optional(),
    reason: z.string().optional(),
    assetId: z.string(),
    previousUser: z.string().nullable().optional(),
    previousDept: z.string().nullable().optional(),
    previousTitle: z.string().nullable().optional(),
  }),
});

const disposalBody = z.object({
  body: z.object({
    disposalDate: z.string(),
    disposalMethod: z.string(),
    disposalReason: z.string().optional(),
    disposalCost: z.number().optional(),
    disposedBy: z.string(),
    assetId: z.string(),
  }),
});

const returnBody = z.object({
  body: z.object({
    assetId: z.string(),
    returnedBy: z.string(),
    reason: z.string().optional(),
  }),
});

router.get('/', list);
router.get('/:id', validate(idParam), getOne);
router.post('/', validate(createBody), auditLog('CREATE', 'IctAsset'), create);
router.patch('/:id', validate(updateBody), auditLog('UPDATE', 'IctAsset'), update);
router.delete('/:id', validate(idParam), auditLog('DELETE', 'IctAsset'), remove);

router.post('/bulk', validate(bulkBody), auditLog('CREATE', 'IctAssetBulk'), bulkCreate);
router.get('/bulk/template', downloadBulkTemplate);
router.post('/bulk/import', upload.single('file'), importBulkFromExcel);
router.post(
  '/requisition',
  validate(perAssetReqBody),
  auditLog('CREATE', 'IctAssetRequisition'),
  createPerAssetRequisition,
);
router.post(
  '/issue',
  validate(directIssueBody),
  auditLog('CREATE', 'IctAssetDirectIssue'),
  createDirectIssue,
);
router.post(
  '/assign-staff',
  validate(assignStaffBody),
  auditLog('UPDATE', 'IctAsset'),
  assignStaff,
);
router.post(
  '/transfer',
  validate(transferBody),
  auditLog('CREATE', 'IctAssetTransfer'),
  transferOwnership,
);
router.post(
  '/disposal',
  validate(disposalBody),
  auditLog('CREATE', 'IctAssetDisposal'),
  disposeAsset,
);
router.post(
  '/return',
  validate(returnBody),
  auditLog('CREATE', 'IctAssetReturn'),
  returnAsset,
);

export const ictAssetsRoutes = router;
