import { Router } from 'express';
import { itemsRoutes } from './items.routes.js';
import { grnRoutes } from './grn.routes.js';
import { ledgerRoutes } from './ledger.routes.js';
import { storeRequisitionsRoutes } from './requisitions.routes.js';
import { storeIssuesRoutes } from './issues.routes.js';

const router = Router();

// NOTE: All Stores endpoints are temporarily public (no auth)
// to unblock testing and rollout; tighten later as needed.
router.use('/items', itemsRoutes);
router.use('/grn', grnRoutes);
router.use('/ledger', ledgerRoutes);
router.use('/requisitions', storeRequisitionsRoutes);
router.use('/issues', storeIssuesRoutes);

export const storesRoutes = router;
