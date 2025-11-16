import dayjs from "dayjs";
import prisma from "../config/database";

export const calculateStreak = async (habitId: string) => {
  
  const logs = await prisma.trackingLog.findMany({
    where: { habitId },
    orderBy: { date: "desc" },
    select: { date: true }
  });

  let streak = 0;
  let expectedDate = dayjs(); 

  for (const log of logs) {
    if (log.date === expectedDate.format("YYYY-MM-DD")) {
      streak++;
      expectedDate = expectedDate.subtract(1, "day");
    } else {
      break;
    }
  }

  return streak;
};
