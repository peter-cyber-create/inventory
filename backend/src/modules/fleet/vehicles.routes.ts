import { Router } from 'express';
import { create, list, getOne, update, remove } from './vehicles.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { auditLog } from '../../middleware/audit.js';
import { z } from 'zod';

const router = Router();
router.use(requireAuth);

const idParam = z.object({ params: z.object({ id: z.string() }) });
const createBody = z.object({
  body: z.object({
    registrationNumber: z.string(),
    make: z.string(),
    model: z.string(),
    year: z.number().optional(),
    status: z.string().optional(),
    assignedDriver: z.string().optional(),
    oldNumberPlate: z.string().optional(),
    newNumberPlate: z.string().optional(),
    type: z.string().optional(),
    chassisNumber: z.string().optional(),
    engineNumber: z.string().optional(),
    fuel: z.string().optional(),
    power: z.number().optional(),
    totalCost: z.number().optional(),
    countryOfOrigin: z.string().optional(),
    color: z.string().optional(),
    userDepartment: z.string().optional(),
    officer: z.string().optional(),
    contact: z.string().optional(),
  }),
});
const updateBody = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    registrationNumber: z.string().optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    year: z.number().optional(),
    status: z.string().optional(),
    assignedDriver: z.string().optional().nullable(),
    oldNumberPlate: z.string().optional().nullable(),
    newNumberPlate: z.string().optional().nullable(),
    type: z.string().optional(),
    chassisNumber: z.string().optional().nullable(),
    engineNumber: z.string().optional().nullable(),
    fuel: z.string().optional().nullable(),
    power: z.number().optional(),
    totalCost: z.number().optional(),
    countryOfOrigin: z.string().optional().nullable(),
    color: z.string().optional().nullable(),
    userDepartment: z.string().optional().nullable(),
    officer: z.string().optional().nullable(),
    contact: z.string().optional().nullable(),
  }),
});

router.get('/', list);
router.get('/:id', validate(idParam), getOne);
router.post('/', validate(createBody), auditLog('CREATE', 'Vehicle'), create);
router.patch('/:id', validate(updateBody), auditLog('UPDATE', 'Vehicle'), update);
router.delete('/:id', validate(idParam), auditLog('DELETE', 'Vehicle'), remove);

export const vehiclesRoutes = router;
