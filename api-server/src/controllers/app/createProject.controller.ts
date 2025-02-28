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

  const userId = req.userId;
  const data = parsedData.data;

  try {
    const count = await prisma.project.count({
      where: {
        userId: userId,
      },
    });

    // if (count >= 1) {
    //   res.status(403).json({
    //     message: "Free users can only create one project.",
    //   });
    //   return;
    // }

    const projectName = data.name.trim().replace(/\s+/g, "-");

    const existing = await prisma.project.findUnique({
      where: { name: projectName },
    });
    if (existing) {
      res.status(409).json({ message: "Project name already exists." });
      return;
    }

    const randomSlug = generateSlug();

    const project = await prisma.project.create({
      data: {
        gitURL: data.gitURL,
        name: data.name.trim().replace(/\s+/g, "-"),
        userId: userId,
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
  } catch (error) {
    console.error("Project creation error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
