import type { RequestHandler } from "express";
import prisma from "../../utils/db";
import { createUserSchema } from "../../validations/auth/validation";
import { getAccessToken } from "../../services/github/auth";
import { getUserDetails } from "../../services/github/resource";
import { encrypt } from "../../utils/encryption";
import jwt from "jsonwebtoken";
import type { AuthToken } from "../../types/auth.types";

export const signin: RequestHandler = async (req, res) => {
  const parsedData = createUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Invalid inputs",
      error: parsedData.error.format(),
    });
    return;
  }
  const data = parsedData.data;

  try {
    const token = await getAccessToken(data.code);
    if (!token) {
      res.status(404).json({ msg: "Cant get access token" });
      return;
    }
    const userGithub = await getUserDetails(token);
    if (!userGithub) {
      res.status(404).json({ msg: "User not found" });
      return;
    }
    const user = await prisma.user.upsert({
      where: {
        username: userGithub.username,
      },
      create: {
        username: userGithub.username,
        avatarUrl: userGithub.avatarUrl,
        email: userGithub.email,
        accessToken: encrypt(token),
      },
      update: {
        username: userGithub.username,
        avatarUrl: userGithub.avatarUrl,
        email: userGithub.email,
        accessToken: encrypt(token),
      },
    });
    const jwtPayLoad: AuthToken = {
      username: userGithub.username,
      id: user.id,
    };
    const jwtToken = jwt.sign(jwtPayLoad, process.env.JWT_SECRET || "");

    res.status(200).json({
      token: jwtToken,
      data: {
        username: user.username,
        avatar: user.avatarUrl,
        email: user.email,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
    return;
  }
};
