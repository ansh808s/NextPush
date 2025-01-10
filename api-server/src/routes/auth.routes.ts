import express from "express";
import { signin } from "../controllers/auth/signin.controller";

const router = express.Router();

router.post("/user", signin);

export default router;
