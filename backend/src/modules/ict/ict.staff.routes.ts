import { Router } from 'express';
import { requireAuth, requireModule } from '../../middleware/auth.js';
import multer from 'multer';
import {
  listStaff,
  downloadStaffTemplate,
  importStaffFromExcel,
  saveImportedStaff,
} from './ict.staff.controller.js';

const router = Router();
router.use(requireAuth, requireModule('ICT'));
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/', listStaff);
router.get('/template', downloadStaffTemplate);
router.post('/import', upload.single('file'), importStaffFromExcel);
router.post('/bulk', saveImportedStaff);

export const ictStaffRoutes = router;

