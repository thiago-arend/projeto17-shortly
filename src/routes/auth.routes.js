import { Router } from "express";
import { usersSignupSchema } from "../schemas/user.schemas.js";
import { signup } from "../controllers/auth.controller.js";
import validateSchema from "../middlewares/validadeSchema.js";

const authRouter = Router();
authRouter.post("/signup", validateSchema(usersSignupSchema), signup);

export default authRouter;