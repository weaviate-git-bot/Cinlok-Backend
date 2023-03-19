import type { Request, Response } from "express"
import UserUseCase from "../../usecase/user"
import { AsyncRoute } from "../../middleware/async-wrapper"
import { updateProfileSchema } from "../../schema"

export const updateProfile = AsyncRoute(async (req: Request, res: Response) => {
    const account = res.locals.account;
    const id = account.id
    const data = updateProfileSchema.parse(req.body)

    const user = await UserUseCase.updateProfile(id, data)
    res.send({
        message: "Update profile success",
        user,
    })
})