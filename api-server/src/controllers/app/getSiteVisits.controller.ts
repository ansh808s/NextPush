import type { RequestHandler } from "express";
import prisma from "../../../prisma/db";
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";

export const getSiteVisits: RequestHandler = async (req, res) => {
  const { id, type } = req.query;
  if (!id || !type || Array.isArray(id)) {
    res.status(400).json({
      message: "Invalid inputs",
    });
    return;
  }
  const date = new Date();
  const visits = await prisma.userSiteAnalytics.count({
    where: {
      projectId: id,
      createdAt: {
        gte: type === "today" ? startOfDay(date) : startOfWeek(date),
        lte: type === "today" ? endOfDay(date) : endOfWeek(date),
      },
    },
  });
  res.status(200).json({ visits });
  return;
};
