import type { RequestHandler } from "express";
import prisma from "../../../prisma/db";
import { createDeploymentSchema } from "../../validations/app/validatons";
import { deployTask } from "../../services/AWS/deployTask";
import type { SupportedFrameworks } from "../../config/constants";

export const createDeployment: RequestHandler = async (req, res) => {
  const userId = req.userId;
  const parsedData = createDeploymentSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid inputs",
      error: parsedData.error.format(),
    });
    return;
  }
  const data = parsedData.data;

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: data.projectId,
        userId: userId,
      },
    });
    if (!project) {
      res.status(403).json({
        message: "You do not own this project or it does not exist.",
      });
      return;
    }

    const deployment = await prisma.$transaction(async (tx) => {
      const createdDeployment = await tx.deployment.create({
        data: {
          projectId: data.projectId,
          status: "QUEUED",
        },
      });

      await tx.project.update({
        where: { id: project.id },
        data: { currentDeploymentId: createdDeployment.id },
      });

      return createdDeployment;
    });

    await deployTask({
      deploymentId: deployment.id,
      gitURL: project.gitURL,
      projectId: project.slug,
      framework: project.framework as `${SupportedFrameworks}`,
      rootDir: project.rootDir,
    });

    res.status(200).json({
      status: "queued",
      deploymentId: deployment.id,
      url: `http://${project.slug}.localhost:8000`,
    });
    return;
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
    return;
  }
};
