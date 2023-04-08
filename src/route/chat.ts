import { Router } from "express";

import { chatController } from "../controller";
import { AuthMiddleware } from "../middleware/auth/user-authenticated";

const ChatRoute = Router();
ChatRoute.put("/token", AuthMiddleware, chatController.upsertToken);
ChatRoute.get("/", AuthMiddleware, chatController.getChat);
ChatRoute.get("/:id/message", AuthMiddleware, chatController.getMessages);
ChatRoute.post("/message", AuthMiddleware, chatController.sendMessage);

export default ChatRoute;
