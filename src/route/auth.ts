import { Router } from "express";

import { authController } from "../controller";

const AuthRoute = Router()
AuthRoute.post("/login", authController.login)
AuthRoute.post("/register", authController.register)

export default AuthRoute
