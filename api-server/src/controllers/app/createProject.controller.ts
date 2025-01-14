import type { RequestHandler } from "express";
import prisma from "../../../prisma/db";
import { createProjectSchema } from "../../validations/app/validatons";
import { generateSlug } from "random-word-slugs";

export const createProject: RequestHandler = async (req, res) => {
  const parsedData = createProjectSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid inputs",
      error: parsedData.error.format(),
    });
    return;
  }
  const data = parsedData.data;
  try {
    const project = await prisma.project.create({
      data: {
        gitURL: data.gitURL,
        name: data.name.trim().replace(/\s+/g, "-"),
        userId: req.userId,
        subDomain: generateSlug(),
      },
      select: {
        id: true,
        subDomain: true,
        name: true,
      },
    });
    res.status(200).json({
      project: project.id,
      subDomain: project.subDomain,
      name: project.name,
      slug: `${project.name}-${project.subDomain}`,
      url: `http://${project.name}-${project.subDomain}.localhost:8000`,
    });
    return;
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
    return;
  }
};
