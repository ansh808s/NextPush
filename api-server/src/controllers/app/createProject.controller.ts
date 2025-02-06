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
  const randomSlug = generateSlug();
  try {
    const project = await prisma.project.create({
      data: {
        gitURL: data.gitURL,
        name: data.name.trim().replace(/\s+/g, "-"),
        userId: req.userId,
        subDomain: randomSlug,
        framework: data.framework,
        rootDir: data.rootDir,
        slug: `${data.name.trim().replace(/\s+/g, "-")}-${randomSlug}`,
      },
    });
    res.status(200).json({
      project: project.id,
      subDomain: project.subDomain,
      name: project.name,
      framework: data.framework,
      rootDir: data.rootDir,
      slug: project.slug,
      url: `http://${project.slug}.localhost:8000`,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
    return;
  }
};
