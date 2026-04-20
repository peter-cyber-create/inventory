import { Router } from 'express';
import { getDepartmentsAndDesignations } from './admin.lookups.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/departments-and-designations', getDepartmentsAndDesignations);

export const adminLookupsRoutes = router;
