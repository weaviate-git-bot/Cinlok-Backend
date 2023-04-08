import { Router } from "express";

import { tagController } from "../controller";

const TagRoute = Router();
TagRoute.get("/", tagController.getTags);
TagRoute.post("/", tagController.addTag);

export default TagRoute;