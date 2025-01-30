import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createProject } from "../controllers/app/createProject.controller";
import { createDeployment } from "../controllers/app/createDeployment.controller";
import { getDeploymentLogs } from "../controllers/app/getDeploymentLogs.controller";

const router = express.Router();

router.post("/project", authMiddleware, createProject);
router.post("/deploy", authMiddleware, createDeployment);
router.get("/logs/:id", authMiddleware, getDeploymentLogs);

export default router;
