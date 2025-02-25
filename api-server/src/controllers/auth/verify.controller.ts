import type { RequestHandler } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

export const verify: RequestHandler = async (req, res) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    res.status(403).json({ message: "You are not logged in" });
    return;
  }
  try {
    const decoded = jwt.verify(
      authToken,
      process.env.JWT_SECRET!
    ) as JwtPayload & { userId: string };
    if (decoded.id) {
      res.status(200).json({ message: "You are logged in" });
      return;
    }
  } catch (error) {
    res.status(403).json({ message: "You are not logged in" });
    return;
  }
};
