import type { RequestHandler } from "express";
import prisma from "../../../prisma/db";

export const getProject: RequestHandler = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.userId;
  if (!projectId) {
    res.status(400).json({
      message: "Project id not provided",
    });
    return;
  }
  try {
    const user = await prisma.project.findUnique({
      where: {
        id: projectId,
        user: {
          id: userId,
        },
      },
      include: {
        Deployment: {
          select: {
            status: true,
            createdAt: true,
            id: true,
          },
        },
        user: {
          select: {
            avatarUrl: true,
            username: true,
            id: true,
          },
        },
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};
