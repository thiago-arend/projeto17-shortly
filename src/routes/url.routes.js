import { Router } from "express";
import validateSchema from "../middlewares/validadeSchema.js";
import { urlSchema } from "../schemas/url.schema.js";
import { createUrl, deleteUrl, getUrl, visitUrl } from "../controllers/url.controller.js";
import { validateAuth } from "../middlewares/validadeAuth.js";

const urlRouter = Router();
urlRouter.post("/urls/shorten", validateSchema(urlSchema), validateAuth, createUrl);
urlRouter.get("/urls/:id", getUrl);
urlRouter.get("/urls/open/:shortUrl", visitUrl);
urlRouter.delete("/urls/:id", validateAuth, deleteUrl);

export default urlRouter;