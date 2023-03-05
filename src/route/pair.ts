import { Router } from "express";

import { pairController } from "../controller";
import { AuthMiddleware } from "../middleware/auth/user-authenticated";

const PairRoute = Router();
PairRoute.post("/accept", AuthMiddleware, pairController.acceptPair);
PairRoute.get("/", AuthMiddleware, pairController.getPair);

export default PairRoute;
