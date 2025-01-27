import type { RequestHandler } from "express";
import prisma from "../../../prisma/db";
import type { GetRepoTreeProps } from "../../types/auth.types";
import { getRepoTreeSchema } from "../../validations/auth/validation";
import { getRepoTreeService } from "../../services/github/resource";

export const getRepoTree: RequestHandler = async (req, res) => {
  const parsedData = getRepoTreeSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid inputs",
      error: parsedData.error.format(),
    });
    return;
  }
  const data = parsedData.data;
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.userId,
      },
      select: {
        username: true,
      },
    });
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }
    const getTreeProps: GetRepoTreeProps = {
      repo: data.repo,
      user: user.username,
      sha: data.sha,
    };
    const tree = await getRepoTreeService(getTreeProps);
    res.status(200).json({ tree });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
    return;
  }
};
