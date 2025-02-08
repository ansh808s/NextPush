import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createProject } from "../controllers/app/createProject.controller";
import { createDeployment } from "../controllers/app/createDeployment.controller";
import { getDeploymentLogs } from "../controllers/app/getDeploymentLogs.controller";
import { getProject } from "../controllers/app/getProject.controller";
import { getSiteVisits } from "../controllers/app/getSiteVisits.controller";
import { getRouteVisits } from "../controllers/app/getRoutesVisits.controller";

const router = express.Router();

router.post("/project", authMiddleware, createProject);
router.post("/deploy", authMiddleware, createDeployment);
router.get("/logs/:id", authMiddleware, getDeploymentLogs);
router.get("/project/:id", authMiddleware, getProject);
router.get("/site-visits", authMiddleware, getSiteVisits);
router.get("/route-visits", authMiddleware, getRouteVisits);

export default router;
