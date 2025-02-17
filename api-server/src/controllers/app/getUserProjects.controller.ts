import type { RequestHandler } from "express";
import prisma from "../../../prisma/db";

export const getUsererojects: RequestHandler = async (req, res) => {
  const userId = req.userId;
  try {
    const projects = await prisma.project.findMany({
      where: {
        userId,
      },
      omit: {
        rootDir: true,
        subDomain: true,
        userId: true,
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
    const formattedProjects = projects.map(({ Deployment, ...project }) => ({
      ...project,
      deployment: Deployment,
    }));
    res.status(200).json(formattedProjects);
    return;
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};
