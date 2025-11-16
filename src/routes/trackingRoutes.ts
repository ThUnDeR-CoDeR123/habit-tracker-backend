import express from 'express';
import * as trackingController from '../controller/trackingController';
import { authMiddleware } from '../middleware/authMiddleware';
import { trackLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.post('/habits/:id/track', authMiddleware, trackLimiter, trackingController.trackHabit);
router.get('/habits/:id/history', authMiddleware, trackingController.getHabitHistory);
router.get('/habits/:id/streak', authMiddleware, trackingController.getHabitStreak);

export default router;
