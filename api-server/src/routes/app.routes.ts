import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createProject } from "../controllers/app/createProject.controller";

const router = express.Router();

router.post("/project", authMiddleware, createProject);

export default router;
