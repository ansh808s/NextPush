import type { RequestHandler } from "express";
import prisma from "../../../prisma/db";
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";
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
      res.status(200).json({
        visits: visits.map((visit) => ({
          date: visit.date.toLocaleDateString("en-US", { weekday: "long" }),
          count: Number(visit.count),
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
