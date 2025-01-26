import type { RequestHandler } from "express";
import prisma from "../../../prisma/db";
import {
  getRepoDetailsUsingQuery,
  getUserRepoDetails,
} from "../../services/github/resource";
import { decrypt } from "../../utils/encryption";
import type { GitHubSearch } from "../../types/auth.types";

export const getRepo: RequestHandler = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.userId,
      },
      select: {
        accessToken: true,
        username: true,
      },
    });
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }
    if (req.query.query) {
      const getRepoDetalsProps: GitHubSearch = {
        query: req.query.query as string,
        user: user.username,
      };
      const repos = await getRepoDetailsUsingQuery(getRepoDetalsProps);
      console.log(repos);
      res.status(200).json({ repos: repos });
      return;
    } else {
      const repos = await getUserRepoDetails(decrypt(user.accessToken));
      res.status(200).json({ repos: repos });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
    return;
  }
};
