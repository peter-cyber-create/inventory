import { Router } from 'express';
import { ictAssetsRoutes } from './ict.assets.routes.js';
import { ictMaintenanceRoutes } from './ict.maintenance.routes.js';
import { ictRequisitionsRoutes } from './ict.requisitions.routes.js';
import { ictIssuesRoutes } from './ict.issues.routes.js';
import { ictServersRoutes } from './ict.servers.routes.js';
import { ictStaffRoutes } from './ict.staff.routes.js';

const router = Router();

router.use('/assets', ictAssetsRoutes);
router.use('/maintenance', ictMaintenanceRoutes);
router.use('/requisitions', ictRequisitionsRoutes);
router.use('/issues', ictIssuesRoutes);
router.use('/servers', ictServersRoutes);
router.use('/staff', ictStaffRoutes);

export const ictRoutes = router;
