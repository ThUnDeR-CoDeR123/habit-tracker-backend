import { Request, Response } from "express";
import prisma from "../config/database";
import dayjs from "dayjs";
import { AuthRequest } from "../middleware/authMiddleware";
import { calculateStreak } from "../utils/streak";

// GET /habits/:id/streak
export const getHabitStreak = async (req: AuthRequest, res: Response) => {
  try {
    const habit = await prisma.habit.findFirst({
      where: { id: req.params.id, userId: req.user!.id }
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found or unauthorized"
      });
    }

    const streak = await calculateStreak(req.params.id);

    res.status(200).json({
      success: true,
      habitId: req.params.id,
      streak
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// POST /habits/:id/track
export const trackHabit = async (req: AuthRequest, res: Response) => {
  const today = dayjs().format("YYYY-MM-DD");

  try {
    const habit = await prisma.habit.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      }
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found or unauthorized"
      });
    }

    
    const log = await prisma.trackingLog.create({
      data: {
        habitId: req.params.id,
        date: today
      }
    });

    res.status(201).json({ success: true, data: log });

  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Already tracked today"
      });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /habits/:id/history (last 7 days)
export const getHabitHistory = async (req: AuthRequest, res: Response) => {
  const fromDate = dayjs().subtract(7, "day").format("YYYY-MM-DD");

  try {
    const habit = await prisma.habit.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      }
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found or unauthorized"
      });
    }

    const history = await prisma.trackingLog.findMany({
      where: {
        habitId: req.params.id,
        date: { gte: fromDate }
      },
      orderBy: { date: "desc" }
    });

    res.status(200).json({ success: true, data: history });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};



