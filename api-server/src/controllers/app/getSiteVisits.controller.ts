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
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export const getSiteVisits: RequestHandler = async (req, res) => {
  const { id, type, timezone = "UTC" } = req.query;
  if (!id || !type || Array.isArray(id) || Array.isArray(timezone)) {
    res.status(400).json({
      message: "Invalid inputs",
    });
    return;
  }
  const timezoneArg = timezone as string;
  const utcDate = new Date();
  const clientDate = toZonedTime(utcDate, timezoneArg);
  try {
    if (type == "today") {
      const clientDayStart = startOfDay(clientDate);
      const clientDayEnd = endOfDay(clientDate);
      const utcDayStart = fromZonedTime(clientDayStart, timezoneArg);
      const utcDayEnd = fromZonedTime(clientDayEnd, timezoneArg);

      const visits = await prisma.userSiteAnalytics.count({
        where: {
          projectId: id,
          createdAt: {
            gte: utcDayStart,
            lte: utcDayEnd,
          },
        },
      });
      res.status(200).json({ visits });
      return;
    } else if (type == "week") {
      const clientWeekStart = startOfWeek(clientDate, { weekStartsOn: 0 });
      const clientWeekEnd = endOfWeek(clientDate, { weekStartsOn: 0 });
      const utcWeekStart = fromZonedTime(clientWeekStart, timezoneArg);
      const utcWeekEnd = fromZonedTime(clientWeekEnd, timezoneArg);

      const rawVisits = await prisma.userSiteAnalytics.findMany({
        where: {
          projectId: id,
          createdAt: {
            gte: utcWeekStart,
            lte: utcWeekEnd,
          },
        },
        select: {
          createdAt: true,
        },
      });

      const allDays = Array.from({ length: 7 }, (_, i) => {
        const dayDate = addDays(clientWeekStart, i);
        return {
          date: format(dayDate, "yyyy-MM-dd"),
          dayName: format(dayDate, "EEEE"),
          count: 0,
        };
      });
      const visitCounts: Record<string, number> = {};
      rawVisits.forEach((visit) => {
        const clientTimezoneDate = toZonedTime(visit.createdAt, timezoneArg);
        const dateKey = format(clientTimezoneDate, "yyyy-MM-dd");
        visitCounts[dateKey] = (visitCounts[dateKey] || 0) + 1;
      });
      Object.entries(visitCounts).forEach(([dateStr, count]) => {
        const dayIndex = allDays.findIndex((day) => day.date === dateStr);
        if (dayIndex !== -1) {
          allDays[dayIndex].count = count as number;
        } else {
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
    console.log(error);
    return;
  }
};
