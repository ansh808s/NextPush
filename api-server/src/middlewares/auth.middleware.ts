import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import type { AuthToken } from "../types/auth.types";

export const authMiddleware: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(403).json({ msg: "Not authorizated" });
    return;
  }
  try {
    const tokenDecoded = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as AuthToken;
    req.userId = tokenDecoded.id;
    next();
  } catch (error) {
    res.status(403).json({ msg: "Not authorizated" });
    return;
  }
};
