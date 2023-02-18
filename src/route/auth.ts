import { Router } from "express";

import { authController } from "../controller";
import { AuthMiddleware } from "../middleware/auth/user-authenticated";

const AuthRoute = Router()
AuthRoute.post("/login", authController.login)
AuthRoute.post("/register", authController.register)
AuthRoute.get("/self", AuthMiddleware, authController.self)

export default AuthRoute
