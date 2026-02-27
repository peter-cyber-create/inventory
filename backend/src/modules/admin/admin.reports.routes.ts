import { Router } from 'express';
import { systemSummary } from './admin.reports.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/summary', systemSummary);

export const adminReportsRoutes = router;
