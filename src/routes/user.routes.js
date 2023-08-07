import { Router } from "express";
import { validateAuth } from "../middlewares/validadeAuth.js";
import { getUserData } from "../controllers/user.controller.js";

const userRouter = Router();
userRouter.get("/users/me", validateAuth, getUserData);

export default userRouter;