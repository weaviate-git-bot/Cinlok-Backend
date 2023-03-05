import { Router } from "express";

import { userController } from "../controller";
import { AuthMiddleware } from "../middleware/auth/user-authenticated";

const UserRoute = Router()
UserRoute.get("/profile", AuthMiddleware, userController.getProfile)
UserRoute.put("/profile", AuthMiddleware, userController.updateProfile)
UserRoute.put("/profile/photo", AuthMiddleware, userController.updateProfilePhoto)

export default UserRoute