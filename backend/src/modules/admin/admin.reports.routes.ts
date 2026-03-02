import { Router } from 'express';
import { systemSummary } from './admin.reports.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();
// Summary is safe to expose to all authenticated users; module-level RBAC
// still applies to the underlying module APIs and pages.
router.use(requireAuth);

router.get('/summary', systemSummary);

export const adminReportsRoutes = router;
