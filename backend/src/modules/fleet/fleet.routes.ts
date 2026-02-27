import { Router } from 'express';
import { vehiclesRoutes } from './vehicles.routes.js';
import { sparePartsRoutes } from './spare-parts.routes.js';
import { requisitionsRoutes } from './requisitions.routes.js';
import { receivingRoutes } from './receiving.routes.js';
import { jobCardsRoutes } from './job-cards.routes.js';

const router = Router();

router.use('/vehicles', vehiclesRoutes);
router.use('/spare-parts', sparePartsRoutes);
router.use('/requisitions', requisitionsRoutes);
router.use('/receiving', receivingRoutes);
router.use('/job-cards', jobCardsRoutes);

export const fleetRoutes = router;
