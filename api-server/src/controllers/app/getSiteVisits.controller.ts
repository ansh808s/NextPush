import type { RequestHandler } from "express";
import prisma from "../../../prisma/db";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
} from "date-fns";
import type { DayVisits } from "../../types/app.types";

export const getSiteVisits: RequestHandler = async (req, res) => {
  const { id, type } = req.query;
  if (!id || !type || Array.isArray(id)) {
    res.status(400).json({
      message: "Invalid inputs",
    });
    return;
  }
  const date = new Date();
  try {
    if (type == "today") {
      const visits = await prisma.userSiteAnalytics.count({
        where: {
          projectId: id,
          createdAt: {
            gte: startOfDay(date),
            lte: endOfDay(date),
          },
        },
      });
      res.status(200).json({ visits });
      return;
    } else if (type == "week") {
      const visits: DayVisits[] = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM "UserSiteAnalytics"
      WHERE project_id = ${id}
        AND created_at >= ${startOfWeek(date)}
        AND created_at <= ${endOfWeek(date)}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

      const allDays = Array.from({ length: 7 }, (_, i) => {
        const dayDate = addDays(startOfWeek(date), i);
        return {
          date: format(dayDate, "yyyy-MM-dd"),
          dayName: format(dayDate, "EEEE"),
          count: 0,
        };
      });
      visits.forEach((visit) => {
        const visitDate = format(new Date(visit.date), "yyyy-MM-dd"); // Format Prisma date correctly
        const dayIndex = allDays.findIndex((day) => day.date === visitDate);

        if (dayIndex !== -1) {
          allDays[dayIndex].count = Number(visit.count);
        }
      });

      res.status(200).json({
        visits: allDays.map((day) => ({
          date: day.dayName,
          count: day.count,
        })),
      });
      return;
    } else {
      res.status(400).json({
        message: "Invalid inputs",
      });
      return;
    }
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
    return;
  }
};
