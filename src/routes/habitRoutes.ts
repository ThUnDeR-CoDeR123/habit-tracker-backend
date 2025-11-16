import express from 'express';
import * as habitController from '../controller/habitController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Protect all routes with authMiddleware
router.post('/habits', authMiddleware, habitController.createHabit);
router.get('/habits', authMiddleware, habitController.getAllHabits);
router.get('/habits/:id', authMiddleware, habitController.getHabitById);
router.put('/habits/:id', authMiddleware, habitController.updateHabit);
router.delete('/habits/:id', authMiddleware, habitController.deleteHabit);

export default router;
