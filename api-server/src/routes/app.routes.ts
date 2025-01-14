import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createProject } from "../controllers/app/createProject.controller";
import { createDeployment } from "../controllers/app/createDeployment.controller";

const router = express.Router();

router.post("/project", authMiddleware, createProject);
router.post("/deploy", authMiddleware, createDeployment);

export default router;
