import { AuthRequest } from '../middleware/authMiddleware';
import { Request, Response } from 'express';
import prisma from '../config/database';


// POST /habits
export const createHabit = async (req: AuthRequest, res: Response) => {
  try {
    const habit = await prisma.habit.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        frequency: req.body.frequency,
        userId: req.user!.id
      },
    });

    res.status(201).json({ success: true, data: habit });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET /habits/:id
export const getHabitById = async (req: AuthRequest, res: Response) => {
  try {
    const habit = await prisma.habit.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!habit) return res.status(404).json({ success: false, message: "Habit not found" });

    res.status(200).json({ success: true, data: habit });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /habits/:id
export const updateHabit = async (req: AuthRequest, res: Response) => {
  try {
    const habit = await prisma.habit.updateMany({
      where: { id: req.params.id, userId: req.user!.id },
      data: req.body,
    });

    if (habit.count === 0) {
      return res.status(404).json({ success: false, message: "Habit not found or unauthorized" });
    }

    res.status(200).json({ success: true, message: "Updated successfully" });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /habits/:id
export const deleteHabit = async (req: AuthRequest, res: Response) => {
  try {
    const habit = await prisma.habit.deleteMany({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (habit.count === 0) {
      return res.status(404).json({ success: false, message: "Habit not found or unauthorized" });
    }

    res.status(200).json({ success: true, message: "Habit deleted" });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllHabits = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;


    const totalItems = await prisma.habit.count({
      where: { userId: req.user!.id }
    });


    const habits = await prisma.habit.findMany({
      where: { userId: req.user!.id },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      totalItems,
      totalPages,
      data: habits
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
