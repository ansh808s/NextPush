import type { RequestHandler } from "express";
import prisma from "../../../prisma/db";

export const getUsererojects: RequestHandler = async (req, res) => {
  const userId = req.userId;
  try {
    const projects = await prisma.project.findMany({
      where: {
        userId,
      },
      include: {
        Deployment: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            status: true,
          },
        },
      },
    });
    res.status(200).json(projects);
    return;
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};
