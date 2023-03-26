import { Router } from "express";

import { chatController } from "../controller";
import { AuthMiddleware } from "../middleware/auth/user-authenticated";

const ChatRoute = Router();
ChatRoute.get("/users", AuthMiddleware, chatController.users);

export default ChatRoute;
