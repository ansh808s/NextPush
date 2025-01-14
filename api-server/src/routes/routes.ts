import express from "express";
import authRouter from "./auth.routes";
import appRouter from "./app.routes";
export const router = express.Router();

router.use("/auth", authRouter);
router.use("/app", appRouter);
