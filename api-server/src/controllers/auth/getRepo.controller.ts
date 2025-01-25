import type { RequestHandler } from "express";
import prisma from "../../../prisma/db";
import { getUserRepoDetails } from "../../services/github/resource";
import { decrypt } from "../../utils/encryption";

export const getRepo: RequestHandler = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.userId,
      },
      select: {
        accessToken: true,
      },
    });
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }
    const repos = await getUserRepoDetails(decrypt(user.accessToken));
    res.status(200).json({ repos: repos });
    return;
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
    return;
  }
};
