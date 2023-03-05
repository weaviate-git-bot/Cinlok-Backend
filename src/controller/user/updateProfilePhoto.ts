import type { Request, Response } from "express"
import UserUseCase from "../../usecase/user"
import { AsyncRoute } from "../../middleware/async-wrapper"
import { updateProfilePhotoSchema } from "../../schema"

export const updateProfilePhoto = AsyncRoute(async (req: Request, res: Response) => {
    const account = res.locals['account'];
    const id = account.id
    const files = updateProfilePhotoSchema.parse(req.files)

    const userPhotos = await UserUseCase.updateProfilePhoto(id, files)
    res.send({
        message: "Update profile photo success",
        userPhotos,
    })
})