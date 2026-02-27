import { Router } from 'express';
import { financeActivitiesRoutes } from './finance.activities.routes.js';

const router = Router();

router.use('/activities', financeActivitiesRoutes);

export const financeRoutes = router;
