import { Router } from 'express';
import { requireAuth, requireModule } from '../../middleware/auth.js';
import {
  activitiesByDate,
  activitiesByFunding,
  activitiesPerPerson,
  pendingAccountability,
  flaggedUsers,
  activityPerParticipant,
  usersAmounts,
  exportFlaggedUsersExcel,
  exportActivityPerParticipantExcel,
  exportUsersAmountsExcel,
} from './finance.reports.controller.js';

const router = Router();

router.use(requireAuth, requireModule('Finance'));

router.get('/activities', activitiesByDate);
router.get('/funding', activitiesByFunding);
router.get('/person', activitiesPerPerson);
router.get('/accountability', pendingAccountability);
router.get('/flagged', flaggedUsers);
router.get('/participant/activity', activityPerParticipant);
router.get('/user/amounts', usersAmounts);

router.get('/flagged/export/excel', exportFlaggedUsersExcel);
router.get('/participant/activity/export/excel', exportActivityPerParticipantExcel);
router.get('/user/amounts/export/excel', exportUsersAmountsExcel);

export const financeReportsRoutes = router;

