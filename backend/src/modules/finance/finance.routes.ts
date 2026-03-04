import { Router } from 'express';
import { financeActivitiesRoutes } from './finance.activities.routes.js';
import { financeReportsRoutes } from './finance.reports.routes.js';

const router = Router();

router.use('/activities', financeActivitiesRoutes);
router.use('/reports', financeReportsRoutes);

export const financeRoutes = router;
