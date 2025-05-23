import type { RequestHandler } from "express";
import prisma from "../../utils/db";
import { startOfDay, endOfDay } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export const getRouteVisits: RequestHandler = async (req, res) => {
  const { id, timezone = "UTC" } = req.query;

  if (!id || Array.isArray(id) || Array.isArray(timezone)) {
    res.status(400).json({
      message: "Invalid inputs",
    });
    return;
  }

  const timezoneArg = timezone as string;
  const utcDate = new Date();
  const clientDate = toZonedTime(utcDate, timezoneArg);

  try {
    const clientDayStart = startOfDay(clientDate);
    const clientDayEnd = endOfDay(clientDate);
    const utcDayStart = fromZonedTime(clientDayStart, timezoneArg);
    const utcDayEnd = fromZonedTime(clientDayEnd, timezoneArg);

    const visits = await prisma.userSiteAnalytics.groupBy({
      by: ["path"],
      where: {
        projectId: id,
        createdAt: {
          gte: utcDayStart,
          lte: utcDayEnd,
        },
      },
      _count: true,
      orderBy: {
        _count: {
          path: "desc",
        },
      },
    });

    res.status(200).json({ visits });
    return;
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
    console.log(error);
    return;
  }
};
