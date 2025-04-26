import express from "express";
import { authenticate, login, register } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const authRouter = express.Router();

authRouter.get("/", authMiddleware, authenticate);
authRouter.post("/register", register);
authRouter.post("/login", login);

export default authRouter;
