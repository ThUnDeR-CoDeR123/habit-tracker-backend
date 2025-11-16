import express from 'express';
import * as habitController from '../controller/habitController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { validateCreateHabit, validateUpdateHabit } from '../models/dto/habit.dto';

const router = express.Router();


router.post('/habits', authMiddleware, validate(validateCreateHabit), habitController.createHabit);
router.get('/habits', authMiddleware, habitController.getAllHabits);
router.get('/habits/:id', authMiddleware, habitController.getHabitById);
router.put('/habits/:id', authMiddleware, validate(validateUpdateHabit), habitController.updateHabit);
router.delete('/habits/:id', authMiddleware, habitController.deleteHabit);

export default router;
