import { Router } from "express";

import { userController } from "../controller";
import { AuthMiddleware } from "../middleware/auth/user-authenticated";
import upload from "../lib/multer";

const UserRoute = Router()
UserRoute.get("/profile", AuthMiddleware, userController.getProfile)
UserRoute.put("/profile", AuthMiddleware, userController.updateProfile)
UserRoute.put("/profile/photo", AuthMiddleware, upload.fields(
    [
        { name: "photo_0", maxCount: 1 },
        { name: "photo_1", maxCount: 1 },
        { name: "photo_2", maxCount: 1 },
        { name: "photo_3", maxCount: 1 },
    ]
), userController.updateProfilePhoto)

export default UserRoute