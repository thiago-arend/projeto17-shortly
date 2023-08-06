import { Router } from "express";
import validateSchema from "../middlewares/validadeSchema.js";
import { urlSchema } from "../schemas/url.schema.js";
import { createUrl, getUrl } from "../controllers/url.controller.js";
import { validateAuth } from "../middlewares/validadeAuth.js";

const urlRouter = Router();
urlRouter.post("/urls/shorten", validateSchema(urlSchema), validateAuth, createUrl);
urlRouter.get("/urls/:id", getUrl);

export default urlRouter;