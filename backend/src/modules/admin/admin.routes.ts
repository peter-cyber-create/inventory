import { Router } from 'express';
import { adminUsersRoutes } from './admin.users.routes.js';
import { adminRolesRoutes } from './admin.roles.routes.js';
import { adminSettingsRoutes } from './admin.settings.routes.js';
import { adminReportsRoutes } from './admin.reports.routes.js';
import { adminDepartmentsRoutes } from './admin.departments.routes.js';

const router = Router();

router.use('/users', adminUsersRoutes);
router.use('/roles', adminRolesRoutes);
router.use('/departments', adminDepartmentsRoutes);
router.use('/settings', adminSettingsRoutes);
router.use('/reports', adminReportsRoutes);

export const adminRoutes = router;
