import express from "express";
import { signin } from "../controllers/auth/signin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getRepo } from "../controllers/auth/getRepo.controller";
import { getRepoTree } from "../controllers/auth/getRepoTree.controller";

const router = express.Router();

router.post("/signin", signin);
router.get("/repo", authMiddleware, getRepo);
router.post("/tree", authMiddleware, getRepoTree);
export default router;
