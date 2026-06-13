import { Router } from 'express';
import * as statisticsController from '../controllers/statisticsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/monthly', statisticsController.getMonthlyStatistics);
router.get('/categories', statisticsController.getCategoryStatistics);

export default router;
