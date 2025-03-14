import type { RequestHandler } from "express";
import prisma from "../../utils/db";

export const deleteProject: RequestHandler = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({
      message: "Project id not provided",
    });
    return;
  }
  try {
    const project = await prisma.project.delete({
      where: { id },
    });
    res.status(200).json({
      message: `Project deleted - ${project.name}`,
    });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
    console.log(error);
    return;
  }
};
