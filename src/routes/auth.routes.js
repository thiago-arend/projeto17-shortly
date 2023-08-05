import { Router } from "express";
import { usersSigninSchema, usersSignupSchema } from "../schemas/user.schemas.js";
import { signin, signup } from "../controllers/auth.controller.js";
import validateSchema from "../middlewares/validadeSchema.js";

const authRouter = Router();
authRouter.post("/signup", validateSchema(usersSignupSchema), signup);
authRouter.post("/signin", validateSchema(usersSigninSchema), signin);

export default authRouter;